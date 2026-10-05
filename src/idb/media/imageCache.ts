import { IDBPDatabase } from 'idb';

import { CachedMedia, MediaDB, dbPromise } from './db';

export type { CachedMedia };
export type ImageToCache = Omit<CachedMedia, 'lastUsed'>;

const TOTAL_BYTES_KEY = 'totalBytes';

// a write per render would cost more than the eviction order is worth, so age the
// timestamp coarsely: a symbol used at all today is as recent as any other
const TOUCH_AFTER_MS = 24 * 60 * 60 * 1000; // 1 day in milliseconds

// re-read inside the write transaction: an eviction may have deleted the record
// between the read above and this write, and putting it back would leave bytes in
// the store that the meta total no longer counts
async function touch(db: IDBPDatabase<MediaDB>, url: string): Promise<void> {
  const tx = db.transaction('cached', 'readwrite');
  const current = await tx.store.get(url);
  if (current) await tx.store.put({ ...current, lastUsed: Date.now() });
  await tx.done;
}

export async function getCachedImage(
  url: string
): Promise<CachedMedia | undefined> {
  try {
    const db = await dbPromise;
    const cached = await db.get('cached', url);

    if (cached && Date.now() - cached.lastUsed > TOUCH_AFTER_MS) {
      touch(db, url).catch((error) => {
        console.error('Failed to touch cached image:', error);
      });
    }

    return cached;
  } catch (error) {
    console.error('Failed to read cached image:', error);
    return undefined;
  }
}

const MAX_CACHE_BYTES = 250 * 1024 * 1024; //250 MB
const MAX_QUOTA_SHARE = 0.1;
// free some headroom when evicting, so a full cache doesn't evict on every write
const EVICT_TO_SHARE = 0.95;

const warned = new Set<string>();

// Boards are the only irreplaceable thing in this origin and they are tiny (~100s
// of KB), so an unbounded image cache would be the whole storage footprint. The
// absolute cap is what enforces that: storage.estimate() only lowers it, and is
// missing on iOS 16 and old Android WebViews. The browser grants quota out of free
// disk, so taking a share of it self-limits on a device with little space left.
async function readBudget(): Promise<number> {
  try {
    const { quota } = (await navigator.storage?.estimate?.()) ?? {};
    return quota
      ? Math.min(MAX_CACHE_BYTES, quota * MAX_QUOTA_SHARE)
      : MAX_CACHE_BYTES;
  } catch (error) {
    return MAX_CACHE_BYTES;
  }
}

let budgetPromise: Promise<number> | null = null;

function budgetBytes(): Promise<number> {
  if (!budgetPromise) budgetPromise = readBudget();
  return budgetPromise;
}

function warnOnce(key: string, message: string): void {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(message);
}

// The cache tracks its own byte total rather than reading storage.estimate().usage,
// which counts everything in the origin, boards included. Eviction is by last use,
// not by whether a board still references the image: a symbol on a board nobody has
// opened in a long time can be dropped, and only shows up as a missing image when
// that board is next opened offline.
export async function putCachedImage(image: ImageToCache): Promise<void> {
  try {
    const db = await dbPromise;
    const budget = await budgetBytes();

    if (image.data.byteLength > budget) {
      warnOnce(
        'oversized',
        `Image too large to cache (${image.data.byteLength} bytes, budget is ` +
          `${budget}); it will load from the network only.`
      );
      return;
    }

    await evict(db, image, budget);
    await store(db, image);
  } catch (error) {
    console.error('Failed to cache image:', error);
  }
}

// Eviction commits on its own so that the store below can fail without taking it
// down: a QuotaExceededError aborts its transaction, and in a shared one that
// rollback would undo the deletes, leaving a cache that can never free space again.
async function evict(
  db: IDBPDatabase<MediaDB>,
  image: ImageToCache,
  budget: number
): Promise<void> {
  const tx = db.transaction(['cached', 'meta'], 'readwrite');
  const cached = tx.objectStore('cached');
  const used = (await tx.objectStore('meta').get(TOTAL_BYTES_KEY)) ?? 0;
  // an already cached url is replaced, not added, so only the delta counts
  const replaced = (await cached.get(image.url))?.data.byteLength ?? 0;
  let total = used - replaced + image.data.byteLength;

  if (total <= budget) {
    await tx.done;
    return;
  }

  warnOnce(
    'full',
    `Image cache full (${budget} bytes); evicting least recently used ` +
      'symbols, which will load from the network only.'
  );

  let survived = 0;
  let cursor = await cached.index('byLastUsed').openCursor();
  while (cursor) {
    // the copy about to be replaced is never worth evicting, but it is still in
    // the store, so the total this leaves behind has to count it
    if (cursor.value.url !== image.url && total > budget * EVICT_TO_SHARE) {
      total -= cursor.value.data.byteLength;
      await cursor.delete();
    } else {
      survived += cursor.value.data.byteLength;
    }
    cursor = await cursor.continue();
  }

  await tx.objectStore('meta').put(survived, TOTAL_BYTES_KEY);
  await tx.done;
}

async function store(
  db: IDBPDatabase<MediaDB>,
  image: ImageToCache
): Promise<void> {
  const tx = db.transaction(['cached', 'meta'], 'readwrite');
  const cached = tx.objectStore('cached');
  const used = (await tx.objectStore('meta').get(TOTAL_BYTES_KEY)) ?? 0;
  const replaced = (await cached.get(image.url))?.data.byteLength ?? 0;

  await cached.put({ ...image, lastUsed: Date.now() });
  await tx
    .objectStore('meta')
    .put(used - replaced + image.data.byteLength, TOTAL_BYTES_KEY);
  await tx.done;
}

export async function clearCachedMedia(): Promise<void> {
  try {
    const db = await dbPromise;
    const tx = db.transaction(['cached', 'meta'], 'readwrite');
    await tx.objectStore('cached').clear();
    await tx.objectStore('meta').put(0, TOTAL_BYTES_KEY);
    await tx.done;
  } catch (error) {
    console.error('Failed to clear cached images:', error);
  }
}
