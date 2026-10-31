import { getArasaacDB } from '../arasaac/arasaacdb';
import { getCachedImage } from './imageCache';
import {
  MAX_STORED_IMAGE_URLS,
  acquireStoredImageUrl,
  clearStoredImageUrls,
  dropStoredImageMiss
} from './storedImageUrls';

jest.mock('../arasaac/arasaacdb', () => ({
  getArasaacDB: jest.fn()
}));

jest.mock('./imageCache', () => ({
  getCachedImage: jest.fn()
}));

const media = () => ({
  type: 'image/png',
  data: new ArrayBuffer(4)
});

let getImageById;
let nextBlobId;

beforeEach(() => {
  jest.clearAllMocks();
  getImageById = jest.fn();
  getArasaacDB.mockReturnValue({ getImageById });
  nextBlobId = 0;
  global.URL.createObjectURL = jest.fn(() => `blob:test/${++nextBlobId}`);
  global.URL.revokeObjectURL = jest.fn();
  clearStoredImageUrls();
  global.URL.revokeObjectURL.mockClear();
});

afterEach(() => {
  clearStoredImageUrls();
});

it('reuses a memoized blob url across mounts without reading IndexedDB again', async () => {
  const url = 'https://globalsymbols.com/repeat.png';
  getCachedImage.mockResolvedValue(media());

  const first = acquireStoredImageUrl(url);
  const firstBlob = await first.promise;
  first.release();

  const second = acquireStoredImageUrl(url);
  const secondBlob = await second.promise;
  second.release();

  expect(firstBlob).toBe('blob:test/1');
  expect(secondBlob).toBe(firstBlob);
  expect(getCachedImage).toHaveBeenCalledTimes(1);
  expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1);
  expect(global.URL.revokeObjectURL).not.toHaveBeenCalled();
});

it('keys entries on both keyPath and image url', async () => {
  const url = 'https://globalsymbols.com/shared.png';
  getImageById.mockResolvedValueOnce(media()).mockResolvedValueOnce(undefined);
  getCachedImage.mockResolvedValue(media());

  const fromArasaac = acquireStoredImageUrl(url, 'arasaac-1');
  const fromCached = acquireStoredImageUrl(url, 'arasaac-miss');

  expect(await fromArasaac.promise).toBe('blob:test/1');
  expect(await fromCached.promise).toBe('blob:test/2');
  expect(getImageById).toHaveBeenCalledTimes(2);
  expect(getCachedImage).toHaveBeenCalledTimes(1);

  fromArasaac.release();
  fromCached.release();
});

it('collapses concurrent lookups in the same tick into one read and blob url', async () => {
  const url = 'https://globalsymbols.com/concurrent.png';
  let resolveRead;
  getCachedImage.mockReturnValue(
    new Promise((resolve) => {
      resolveRead = resolve;
    })
  );

  const first = acquireStoredImageUrl(url);
  const second = acquireStoredImageUrl(url);
  resolveRead(media());

  const [firstBlob, secondBlob] = await Promise.all([
    first.promise,
    second.promise
  ]);

  expect(firstBlob).toBe('blob:test/1');
  expect(secondBlob).toBe('blob:test/1');
  expect(getCachedImage).toHaveBeenCalledTimes(1);
  expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1);

  first.release();
  expect(global.URL.revokeObjectURL).not.toHaveBeenCalled();
  second.release();
  expect(global.URL.revokeObjectURL).not.toHaveBeenCalled();
});

it('memoizes misses until invalidated by caching or reconnecting', async () => {
  const firstMiss = 'https://globalsymbols.com/miss-1.png';
  const secondMiss = 'https://globalsymbols.com/miss-2.png';
  const hit = 'https://globalsymbols.com/hit.png';
  getCachedImage.mockImplementation(async (requested) =>
    requested === hit ? media() : undefined
  );

  const h1 = acquireStoredImageUrl(firstMiss);
  expect(await h1.promise).toBeUndefined();
  h1.release();

  const h2 = acquireStoredImageUrl(firstMiss);
  expect(await h2.promise).toBeUndefined();
  h2.release();
  expect(getCachedImage).toHaveBeenCalledTimes(1);

  const hitHandle = acquireStoredImageUrl(hit);
  expect(await hitHandle.promise).toBe('blob:test/1');
  hitHandle.release();

  const secondHandle = acquireStoredImageUrl(secondMiss);
  expect(await secondHandle.promise).toBeUndefined();
  secondHandle.release();
  expect(getCachedImage).toHaveBeenCalledTimes(3);

  getCachedImage.mockResolvedValue(media());
  dropStoredImageMiss(firstMiss);

  const afterCache = acquireStoredImageUrl(firstMiss);
  expect(await afterCache.promise).toBe('blob:test/2');
  afterCache.release();

  // secondMiss is still memoized until an online event fires
  const stillMissed = acquireStoredImageUrl(secondMiss);
  expect(await stillMissed.promise).toBeUndefined();
  stillMissed.release();
  expect(getCachedImage).toHaveBeenCalledTimes(4);

  window.dispatchEvent(new Event('online'));

  const afterOnline = acquireStoredImageUrl(secondMiss);
  expect(await afterOnline.promise).toBe('blob:test/3');
  afterOnline.release();
  expect(global.URL.revokeObjectURL).not.toHaveBeenCalled();
});

it('evicts and revokes only the oldest unretained entries above MAX_STORED_IMAGE_URLS', async () => {
  getCachedImage.mockResolvedValue(media());

  // Entry 0 stays retained (refs = 1); entry 1 is released and becomes the oldest evictable entry
  const retained = acquireStoredImageUrl('https://globalsymbols.com/0.png');
  await retained.promise;

  const handles = [];
  for (let i = 1; i <= MAX_STORED_IMAGE_URLS; i += 1) {
    const handle = acquireStoredImageUrl(`https://globalsymbols.com/${i}.png`);
    // eslint-disable-next-line no-await-in-loop
    await handle.promise;
    handle.release();
    handles.push(handle);
  }

  expect(global.URL.revokeObjectURL).toHaveBeenCalledTimes(1);
  expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:test/2');
  expect(global.URL.revokeObjectURL).not.toHaveBeenCalledWith('blob:test/1');

  retained.release();
});

it('treats MAX_STORED_IMAGE_URLS as a floor when all entries remain retained', async () => {
  getCachedImage.mockResolvedValue(media());

  const retained = [];
  for (let i = 0; i <= MAX_STORED_IMAGE_URLS; i += 1) {
    const handle = acquireStoredImageUrl(
      `https://globalsymbols.com/pinned-${i}.png`
    );
    // eslint-disable-next-line no-await-in-loop
    await handle.promise;
    retained.push(handle);
  }

  expect(global.URL.revokeObjectURL).not.toHaveBeenCalled();

  retained[0].release();
  expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:test/1');

  retained.slice(1).forEach((handle) => handle.release());
});

it('revokes an in-flight lookup in its own .then if cleared before settling', async () => {
  let resolveRead;
  getCachedImage.mockReturnValue(
    new Promise((resolve) => {
      resolveRead = resolve;
    })
  );

  const inFlight = acquireStoredImageUrl(
    'https://globalsymbols.com/inflight.png'
  );
  clearStoredImageUrls();

  resolveRead(media());
  expect(await inFlight.promise).toBeUndefined();
  expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1);
  expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:test/1');
});

it('clearStoredImageUrls revokes every stored blob url and empties the memo', async () => {
  getCachedImage.mockResolvedValue(media());

  const first = acquireStoredImageUrl('https://globalsymbols.com/a.png');
  const second = acquireStoredImageUrl('https://globalsymbols.com/b.png');
  await Promise.all([first.promise, second.promise]);
  first.release();

  clearStoredImageUrls();

  expect(global.URL.revokeObjectURL).toHaveBeenCalledTimes(2);
  expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:test/1');
  expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:test/2');

  const again = acquireStoredImageUrl('https://globalsymbols.com/a.png');
  expect(await again.promise).toBe('blob:test/3');
  again.release();
});
