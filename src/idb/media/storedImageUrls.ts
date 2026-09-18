import { getArasaacDB } from '../arasaac/arasaacdb';
import { getCachedImage } from './imageCache';

interface Entry {
  image?: string;
  keyPath?: string;
  refCount: number;
  resolved: boolean;
  blobUrl: string | null;
  evicted: boolean;
  promise: Promise<string | null>;
}

// A session memo of stored-image blob urls, keyed on the (keyPath, image) pair
// that produced them, not the url alone: getStoredImage tries the Arasaac
// store by keyPath first and only falls back to the cached-media store by
// url, so the url alone does not identify the answer.
const memo = new Map<string, Entry>();

// A floor, not a hard cap: an entry a mounted <img> is relying on (refCount >
// 0) is never evicted, so the map can grow past this while boards with more
// than MAX_ENTRIES live tiles are open.
const MAX_ENTRIES = 300;

function memoKey(image?: string, keyPath?: string): string {
  return `${keyPath ?? ''}|${image ?? ''}`;
}

export function isRemote(url?: string): boolean {
  return /^https?:\/\//.test(url ?? '');
}

async function getStoredImage(
  image?: string,
  keyPath?: string
): Promise<{ data: ArrayBuffer; type: string } | undefined> {
  if (keyPath) {
    try {
      const media = await getArasaacDB().getImageById(keyPath);
      if (media) return media;
    } catch (error) {
      console.error('Failed to fetch Arasaac image from Indexed DB:', error);
    }
  }

  return image && isRemote(image) ? getCachedImage(image) : undefined;
}

async function load(entry: Entry): Promise<string | null> {
  let blobUrl: string | null = null;

  try {
    const media = await getStoredImage(entry.image, entry.keyPath);
    if (media) {
      blobUrl = URL.createObjectURL(
        new Blob([media.data], { type: media.type })
      );
    }
  } catch (error) {
    console.error('Failed to load stored image:', error);
  }

  // Dropped by evictIfNeeded or clearStoredImageUrls while this read was in
  // flight: there was nothing to revoke then, so do it now instead of
  // leaking the url.
  if (entry.evicted) {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    return null;
  }

  entry.blobUrl = blobUrl;
  entry.resolved = true;
  return blobUrl;
}

function ensureEntry(
  image: string | undefined,
  keyPath: string | undefined
): Entry {
  const key = memoKey(image, keyPath);
  let entry = memo.get(key);

  if (!entry) {
    entry = {
      image,
      keyPath,
      refCount: 0,
      resolved: false,
      blobUrl: null,
      evicted: false,
      promise: null as unknown as Promise<string | null>
    };
    // Inserted before the first await inside load(): a second caller for the
    // same key in this tick finds the entry already here and reuses its
    // promise instead of starting a second IndexedDB read.
    memo.set(key, entry);
    entry.promise = load(entry);
  }

  return entry;
}

function evictIfNeeded(): void {
  if (memo.size <= MAX_ENTRIES) return;

  // Snapshotted in insertion order before deleting: mutating the map while
  // iterating it directly is unsafe, and this is also what lets es5 target
  // (no downlevel Map iteration) walk it at all.
  for (const [key, entry] of Array.from(memo)) {
    if (memo.size <= MAX_ENTRIES) break;
    if (entry.refCount > 0) continue;

    memo.delete(key);
    if (entry.resolved) {
      if (entry.blobUrl) URL.revokeObjectURL(entry.blobUrl);
    } else {
      entry.evicted = true;
    }
  }
}

// Reads the memoized answer for (image, keyPath), starting the IndexedDB
// lookup on first call, and retains the entry: this call must be paired with
// exactly one releaseStoredImageUrl() for the same (image, keyPath) once the
// caller no longer needs it. A caller that wants to read again without
// retaining again (e.g. a second, unrelated error on an already-acquired
// image) should reuse the promise this returned rather than calling again.
export function getStoredImageUrl(
  image?: string,
  keyPath?: string
): Promise<string | null> {
  const entry = ensureEntry(image, keyPath);
  entry.refCount++;
  evictIfNeeded();
  return entry.promise;
}

// A released entry keeps its url -- that is the point of memoizing at all.
// It only goes away later, via eviction or clearStoredImageUrls().
export function releaseStoredImageUrl(image?: string, keyPath?: string): void {
  const entry = memo.get(memoKey(image, keyPath));
  if (entry && entry.refCount > 0) entry.refCount--;
}

function dropNegativeEntries(): void {
  for (const [key, entry] of Array.from(memo)) {
    if (entry.resolved && entry.blobUrl === null) memo.delete(key);
  }
}

// Called once a remote image has been successfully written to the cached-media
// store, so a tile that missed moments ago is not stuck answering from a memo
// that predates the write.
export function dropStoredImageMiss(url: string): void {
  for (const [key, entry] of Array.from(memo)) {
    if (entry.image === url && entry.resolved && entry.blobUrl === null) {
      memo.delete(key);
    }
  }
}

if (typeof window !== 'undefined') {
  // Reconnecting turns a sticky miss back into a transient one: forget every
  // negative entry so the next lookup -- via SymbolImage repainting a blank
  // tile's remote url, or a fresh mount -- can find what is now reachable
  // instead of repeating a stale blank.
  window.addEventListener('online', dropNegativeEntries);
}

// Revokes every memoized url and empties the map. Called on logout so a
// second account never renders the first account's images from blob urls
// whose IndexedDB records are gone. Also useful to reset module state between
// test cases.
export function clearStoredImageUrls(): void {
  for (const entry of Array.from(memo.values())) {
    if (entry.resolved) {
      if (entry.blobUrl) URL.revokeObjectURL(entry.blobUrl);
    } else {
      entry.evicted = true;
    }
  }
  memo.clear();
}
