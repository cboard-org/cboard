import { DBSchema, IDBPDatabase, openDB } from 'idb';

export interface CachedImage {
  url: string;
  type: string;
  data: ArrayBuffer;
}

interface ImageCacheDB extends DBSchema {
  images: {
    key: string;
    value: CachedImage;
  };
  meta: {
    key: string;
    value: number;
  };
}

const TOTAL_BYTES_KEY = 'totalBytes';

const dbPromise = openDB<ImageCacheDB>('cboard-image-cache', 1, {
  upgrade(db: IDBPDatabase<ImageCacheDB>): void {
    db.createObjectStore('images', { keyPath: 'url' });
    db.createObjectStore('meta');
  }
});

export async function getCachedImage(
  url: string
): Promise<CachedImage | undefined> {
  try {
    const db = await dbPromise;
    return await db.get('images', url);
  } catch (error) {
    console.error('Failed to read cached image:', error);
    return undefined;
  }
}

const MAX_CACHE_BYTES = 250 * 1024 * 1024;
const MAX_QUOTA_SHARE = 0.1;

let warnedAboutBudget = false;

// Boards are the only irreplaceable thing in this origin and they are tiny (~100s
// of KB), so an unbounded image cache would be the whole storage footprint. The
// absolute cap is what enforces that: storage.estimate() only lowers it, and is
// missing on iOS 16 and old Android WebViews. The browser grants quota out of free
// disk, so taking a share of it self-limits on a device with little space left.
// Over budget we simply stop caching: symbols fall back to loading from the
// network, which is what they did before any of this.
async function budgetBytes(): Promise<number> {
  const { quota } = (await navigator.storage?.estimate?.()) ?? {};
  return quota
    ? Math.min(MAX_CACHE_BYTES, quota * MAX_QUOTA_SHARE)
    : MAX_CACHE_BYTES;
}

function warnOnceAboutBudget(used: number, budget: number): void {
  // symbols added from here on stop working offline, which is invisible from the
  // ui, so say it once rather than per image
  if (warnedAboutBudget) return;
  warnedAboutBudget = true;
  console.warn(
    `Image cache budget reached (${used} of ${budget} bytes used); ` +
      'new symbols will load from the network only.'
  );
}

// No eviction: entries are never removed, not even when the tile or board that
// referenced them is deleted. Callers decide what is worth persisting. The cache
// tracks its own byte total rather than reading storage.estimate().usage, which
// counts everything in the origin, boards included.
export async function putCachedImage(image: CachedImage): Promise<void> {
  try {
    const db = await dbPromise;
    // outside the transaction: awaiting a non-idb promise inside it commits it early
    const budget = await budgetBytes();

    const tx = db.transaction(['images', 'meta'], 'readwrite');
    const images = tx.objectStore('images');
    const used = (await tx.objectStore('meta').get(TOTAL_BYTES_KEY)) ?? 0;
    // an already cached url is replaced, not added, so only the delta counts
    const replaced = (await images.get(image.url))?.data.byteLength ?? 0;
    const total = used - replaced + image.data.byteLength;

    if (total > budget) {
      warnOnceAboutBudget(used, budget);
      await tx.done;
      return;
    }

    await images.put(image);
    await tx.objectStore('meta').put(total, TOTAL_BYTES_KEY);
    await tx.done;
  } catch (error) {
    console.error('Failed to cache image:', error);
  }
}
