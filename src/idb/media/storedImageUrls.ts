import { getArasaacDB } from '../arasaac/arasaacdb';
import { getCachedImage } from './imageCache';

export const MAX_STORED_IMAGE_URLS = 300;

interface StoredImageEntry {
  image?: string;
  refs: number;
  inFlight: boolean;
  evicted: boolean;
  invalidated: boolean;
  url?: string;
  promise: Promise<string | undefined>;
}

export interface StoredImageHandle {
  promise: Promise<string | undefined>;
  release: () => void;
}

const memo = new Map<string, StoredImageEntry>();

const isRemote = (src?: string): boolean => /^https?:\/\//.test(src ?? '');

const keyFor = (image?: string, keyPath?: string): string =>
  `${keyPath ?? ''}|${image ?? ''}`;

async function readStoredImage(
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

  return isRemote(image) && image ? getCachedImage(image) : undefined;
}

function evict(): void {
  if (memo.size <= MAX_STORED_IMAGE_URLS) return;

  memo.forEach((candidate, key) => {
    if (memo.size <= MAX_STORED_IMAGE_URLS) return;
    if (candidate.refs > 0 || candidate.inFlight) return;

    memo.delete(key);
    if (candidate.url) {
      URL.revokeObjectURL(candidate.url);
      candidate.url = undefined;
    }
  });
}

function makeHandle(entry: StoredImageEntry): StoredImageHandle {
  let released = false;
  return {
    promise: entry.promise,
    release: () => {
      if (released) return;
      released = true;
      entry.refs = Math.max(0, entry.refs - 1);
      evict();
    }
  };
}

export function acquireStoredImageUrl(
  image?: string,
  keyPath?: string
): StoredImageHandle {
  if (!image && !keyPath) {
    return { promise: Promise.resolve(undefined), release: () => {} };
  }

  const key = keyFor(image, keyPath);
  const existing = memo.get(key);
  if (existing) {
    memo.delete(key);
    memo.set(key, existing);
    existing.refs += 1;
    return makeHandle(existing);
  }

  const entry: StoredImageEntry = {
    image,
    refs: 1,
    inFlight: true,
    evicted: false,
    invalidated: false,
    promise: Promise.resolve(undefined)
  };

  entry.promise = readStoredImage(image, keyPath).then((media) => {
    entry.inFlight = false;

    if (!media) {
      if (entry.evicted || entry.invalidated) {
        if (memo.get(key) === entry) memo.delete(key);
      } else {
        evict();
      }
      return undefined;
    }

    const url = URL.createObjectURL(
      new Blob([media.data], { type: media.type })
    );

    if (entry.evicted) {
      URL.revokeObjectURL(url);
      return undefined;
    }

    entry.url = url;
    evict();
    return url;
  });

  memo.set(key, entry);
  evict();

  return makeHandle(entry);
}

export function dropStoredImageMiss(url: string): void {
  if (!url) return;
  memo.forEach((entry, key) => {
    if (entry.image !== url) return;
    if (entry.inFlight) {
      entry.invalidated = true;
    } else if (!entry.url) {
      memo.delete(key);
    }
  });
}

export function dropStoredImageMisses(): void {
  memo.forEach((entry, key) => {
    if (entry.inFlight) {
      entry.invalidated = true;
    } else if (!entry.url) {
      memo.delete(key);
    }
  });
}

export function clearStoredImageUrls(): void {
  memo.forEach((entry) => {
    entry.evicted = true;
    if (entry.url) {
      URL.revokeObjectURL(entry.url);
      entry.url = undefined;
    }
  });
  memo.clear();
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', dropStoredImageMisses);
}
