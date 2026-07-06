import { DBSchema, openDB } from 'idb';

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
  upgrade(db) {
    db.createObjectStore('images', { keyPath: 'url' });
  },
});

export async function getCachedImage(
  url: string,
): Promise<CachedImage | undefined> {
  const db = await dbPromise;
  return db.get('images', url);
}

export async function putCachedImage(image: CachedImage): Promise<void> {
  const db = await dbPromise;
  await db.put('images', image);
}
