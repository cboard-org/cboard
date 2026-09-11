import { DBSchema, IDBPDatabase, openDB } from 'idb';

export interface CachedMedia {
  url: string;
  type: string;
  data: ArrayBuffer;
  lastUsed: number;
}

// user media held until it can be uploaded. Nothing writes to it yet: the store
// is created at v1 so adding it later never needs a version bump, which an open
// tab in another window would block.
export interface LocalMedia {
  id: string;
  kind: 'image' | 'sound' | 'caption';
  type: string;
  data: ArrayBuffer;
  fileName: string;
  createdAt: number;
}

// One database for board media, two stores with opposite lifetimes: `cached` is
// replaceable and evictable, `local` is the only copy there is and is never
// evicted.
export interface MediaDB extends DBSchema {
  cached: {
    key: string;
    value: CachedMedia;
    indexes: { byLastUsed: number };
  };
  local: {
    key: string;
    value: LocalMedia;
    indexes: { byCreatedAt: number };
  };
  meta: {
    key: string;
    value: number;
  };
}

let openedDB: IDBPDatabase<MediaDB> | null = null;

export const dbPromise = openDB<MediaDB>('cboard-media', 1, {
  upgrade(db: IDBPDatabase<MediaDB>): void {
    const cached = db.createObjectStore('cached', { keyPath: 'url' });
    cached.createIndex('byLastUsed', 'lastUsed');

    const local = db.createObjectStore('local', { keyPath: 'id' });
    local.createIndex('byCreatedAt', 'createdAt');

    db.createObjectStore('meta');
  },
  blocked(): void {
    console.warn('Media database upgrade is blocked by another open tab.');
  },
  // another tab is upgrading: hold the connection open and it waits forever
  blocking(): void {
    openedDB?.close();
    openedDB = null;
  },
  terminated(): void {
    openedDB = null;
  }
});

// where IndexedDB is unavailable (private mode, webviews with storage off) the
// open rejects at import time, before any call site has attached a handler
dbPromise
  .then((db: IDBPDatabase<MediaDB>) => {
    openedDB = db;
  })
  .catch((error: unknown) => {
    console.error('Media database unavailable:', error);
  });
