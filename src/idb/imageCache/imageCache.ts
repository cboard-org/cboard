import { DBSchema, IDBPDatabase, openDB } from 'idb';

export interface CachedImage {
  url: string;
  type: string;
  data: ArrayBuffer;
  lastUsed: number;
}

// callers cache an image, they don't decide when it was last used
export type ImageToCache = Omit<CachedImage, 'lastUsed'>;

interface ImageCacheDB extends DBSchema {
  images: {
    key: string;
    value: CachedImage;
    indexes: { byLastUsed: number };
  };
  meta: {
    key: string;
    value: number;
  };
}

const TOTAL_BYTES_KEY = 'totalBytes';

const dbPromise = openDB<ImageCacheDB>('cboard-image-cache', 1, {
  upgrade(db: IDBPDatabase<ImageCacheDB>): void {
    const images = db.createObjectStore('images', { keyPath: 'url' });
    images.createIndex('byLastUsed', 'lastUsed');
    db.createObjectStore('meta');
  }
});

// a write per render would cost more than the eviction order is worth, so age the
// timestamp coarsely: a symbol used at all today is as recent as any other
const TOUCH_AFTER_MS = 24 * 60 * 60 * 1000;

export async function getCachedImage(
  url: string
): Promise<CachedImage | undefined> {
  try {
    const db = await dbPromise;
    const cached = await db.get('images', url);

    if (cached && Date.now() - cached.lastUsed > TOUCH_AFTER_MS) {
      try {
        await db.put('images', { ...cached, lastUsed: Date.now() });
      } catch (error) {
        // a failed touch costs eviction order, not the hit we already have
        console.error('Failed to touch cached image:', error);
      }
    }

    return cached;
  } catch (error) {
    console.error('Failed to read cached image:', error);
    return undefined;
  }
}

const MAX_CACHE_BYTES = 250 * 1024 * 1024;
const MAX_QUOTA_SHARE = 0.1;
// free some headroom when evicting, so a full cache doesn't evict on every write
const EVICT_TO_SHARE = 0.95;

let warned = false;

// Boards are the only irreplaceable thing in this origin and they are tiny (~100s
// of KB), so an unbounded image cache would be the whole storage footprint. The
// absolute cap is what enforces that: storage.estimate() only lowers it, and is
// missing on iOS 16 and old Android WebViews. The browser grants quota out of free
// disk, so taking a share of it self-limits on a device with little space left.
async function budgetBytes(): Promise<number> {
  const { quota } = (await navigator.storage?.estimate?.()) ?? {};
  return quota
    ? Math.min(MAX_CACHE_BYTES, quota * MAX_QUOTA_SHARE)
    : MAX_CACHE_BYTES;
}

function warnOnce(message: string): void {
  // uncached symbols silently stop working offline, which is invisible from the
  // ui, so say it once rather than per image
  if (warned) return;
  warned = true;
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
    // outside the transaction: awaiting a non-idb promise inside it commits it early
    const budget = await budgetBytes();

    if (image.data.byteLength > budget) {
      warnOnce(
        `Image too large to cache (${image.data.byteLength} bytes, budget is ` +
          `${budget}); it will load from the network only.`
      );
      return;
    }

    const tx = db.transaction(['images', 'meta'], 'readwrite');
    const images = tx.objectStore('images');
    const used = (await tx.objectStore('meta').get(TOTAL_BYTES_KEY)) ?? 0;
    // an already cached url is replaced, not added, so only the delta counts
    const replaced = (await images.get(image.url))?.data.byteLength ?? 0;
    let total = used - replaced + image.data.byteLength;

    if (total > budget) {
      warnOnce(
        `Image cache full (${budget} bytes); evicting least recently used ` +
          'symbols, which will load from the network only.'
      );

      let cursor = await images.index('byLastUsed').openCursor();
      while (cursor && total > budget * EVICT_TO_SHARE) {
        // the image being written is already accounted for above
        if (cursor.value.url !== image.url) {
          total -= cursor.value.data.byteLength;
          await cursor.delete();
        }
        cursor = await cursor.continue();
      }
    }

    await images.put({ ...image, lastUsed: Date.now() });
    await tx.objectStore('meta').put(total, TOTAL_BYTES_KEY);
    await tx.done;
  } catch (error) {
    console.error('Failed to cache image:', error);
  }
}
