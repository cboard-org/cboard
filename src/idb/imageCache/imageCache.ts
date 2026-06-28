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
}

const dbPromise = openDB<ImageCacheDB>('cboard-image-cache', 1, {
  upgrade(db: IDBPDatabase<ImageCacheDB>): void {
    db.createObjectStore('images', { keyPath: 'url' });
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
// browser grants quota out of free disk, so taking a share of it self-limits on a
// device with little space left. Over budget we simply stop caching: symbols fall
// back to loading from the network, which is what they did before any of this.
async function isWithinBudget(bytes: number): Promise<boolean> {
  if (!navigator.storage?.estimate) return true;

  const { quota = 0, usage = 0 } = await navigator.storage.estimate();
  if (!quota) return true;

  const budget = Math.min(MAX_CACHE_BYTES, quota * MAX_QUOTA_SHARE);
  if (usage + bytes <= budget) return true;

  // symbols added from here on stop working offline, which is invisible from the
  // ui, so say it once rather than per image
  if (!warnedAboutBudget) {
    warnedAboutBudget = true;
    console.warn(
      `Image cache budget reached (${usage} of ${budget} bytes used); ` +
        'new symbols will load from the network only.'
    );
  }

  return false;
}

// No eviction: entries are never removed, not even when the tile or board that
// referenced them is deleted. Callers decide what is worth persisting.
export async function putCachedImage(image: CachedImage): Promise<void> {
  try {
    if (!(await isWithinBudget(image.data.byteLength))) return;

    const db = await dbPromise;
    await db.put('images', image);
  } catch (error) {
    console.error('Failed to cache image:', error);
  }
}
