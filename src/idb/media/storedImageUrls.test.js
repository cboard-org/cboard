import {
  getStoredImageUrl,
  releaseStoredImageUrl,
  clearStoredImageUrls,
  dropStoredImageMiss
} from './storedImageUrls';
import { getCachedImage } from './imageCache';
import { getArasaacDB } from '../arasaac/arasaacdb';

jest.mock('./imageCache', () => ({
  getCachedImage: jest.fn()
}));

jest.mock('../arasaac/arasaacdb', () => ({
  getArasaacDB: jest.fn()
}));

let blobUrlCount;
let revoked;

const media = (bytes = 8) => ({
  type: 'image/png',
  data: new ArrayBuffer(bytes)
});

beforeEach(() => {
  jest.clearAllMocks();
  blobUrlCount = 0;
  revoked = [];
  global.URL.createObjectURL = jest.fn(() => `blob:test/${++blobUrlCount}`);
  global.URL.revokeObjectURL = jest.fn((url) => revoked.push(url));
  getArasaacDB.mockReturnValue({
    getImageById: jest.fn().mockResolvedValue(undefined)
  });
});

afterEach(() => {
  clearStoredImageUrls();
});

it('reads the arasaac store by keyPath before falling back to the url', async () => {
  const keyPath = 'symbol-1';
  getArasaacDB().getImageById.mockResolvedValue(media());

  const url = await getStoredImageUrl(
    'https://example.com/ignored.png',
    keyPath
  );

  expect(url).toMatch(/^blob:/);
  expect(getCachedImage).not.toHaveBeenCalled();
});

it('collapses two callers sharing a key in one tick into a single lookup', async () => {
  const url = 'https://example.com/shared.png';
  getCachedImage.mockResolvedValue(media());

  const first = getStoredImageUrl(url);
  const second = getStoredImageUrl(url);
  const [a, b] = await Promise.all([first, second]);

  expect(getCachedImage).toHaveBeenCalledTimes(1);
  expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1);
  expect(a).toBe(b);

  releaseStoredImageUrl(url);
  releaseStoredImageUrl(url);
});

it('memoizes a miss so a repeated lookup does not read IndexedDB again', async () => {
  const url = 'https://example.com/missing.png';
  getCachedImage.mockResolvedValue(undefined);

  const first = await getStoredImageUrl(url);
  releaseStoredImageUrl(url);
  const second = await getStoredImageUrl(url);
  releaseStoredImageUrl(url);

  expect(first).toBeNull();
  expect(second).toBeNull();
  expect(getCachedImage).toHaveBeenCalledTimes(1);
});

it('keeps a released url alive and does not revoke it', async () => {
  const url = 'https://example.com/kept.png';
  getCachedImage.mockResolvedValue(media());

  const first = await getStoredImageUrl(url);
  releaseStoredImageUrl(url);

  const second = await getStoredImageUrl(url);
  releaseStoredImageUrl(url);

  expect(second).toBe(first);
  expect(getCachedImage).toHaveBeenCalledTimes(1);
  expect(global.URL.revokeObjectURL).not.toHaveBeenCalled();
});

it('does not revoke a still-retained url when another caller releases', async () => {
  const url = 'https://example.com/retained.png';
  getCachedImage.mockResolvedValue(media());

  await getStoredImageUrl(url); // tile A acquires
  await getStoredImageUrl(url); // tile B acquires
  releaseStoredImageUrl(url); // tile A releases, tile B still holds it

  expect(global.URL.revokeObjectURL).not.toHaveBeenCalled();

  releaseStoredImageUrl(url);
});

it('evicts the oldest unretained entries once over the entry cap, revoking their urls', async () => {
  getCachedImage.mockImplementation(async () => media());

  // stays retained throughout (never released): must survive the eviction below
  const retainedUrl = 'https://example.com/entry-retained.png';
  const retainedBlobUrl = await getStoredImageUrl(retainedUrl);

  const blobUrlByUrl = new Map();
  const urls = Array.from(
    { length: 305 },
    (_, i) => `https://example.com/entry-${i}.png`
  );
  for (const url of urls) {
    const blobUrl = await getStoredImageUrl(url);
    blobUrlByUrl.set(url, blobUrl);
    releaseStoredImageUrl(url); // unretained: eligible for eviction
  }

  const oldest = urls[0];
  const newest = urls[urls.length - 1];

  expect(revoked).toContain(blobUrlByUrl.get(oldest));
  expect(revoked).not.toContain(blobUrlByUrl.get(newest));
  expect(revoked).not.toContain(retainedBlobUrl);

  // survivors answer instantly, with no further IndexedDB read
  getCachedImage.mockClear();
  expect(await getStoredImageUrl(newest)).toBe(blobUrlByUrl.get(newest));
  expect(await getStoredImageUrl(retainedUrl)).toBe(retainedBlobUrl);
  expect(getCachedImage).not.toHaveBeenCalled();

  releaseStoredImageUrl(newest);
  releaseStoredImageUrl(retainedUrl);
  releaseStoredImageUrl(retainedUrl);
});

it('revokes an entry evicted while still in flight once its lookup resolves', async () => {
  let resolveLookup;
  getCachedImage.mockImplementation(
    () =>
      new Promise((resolve) => {
        resolveLookup = resolve;
      })
  );

  const oldestUrl = 'https://example.com/in-flight.png';
  const oldestPromise = getStoredImageUrl(oldestUrl);
  releaseStoredImageUrl(oldestUrl); // unretained before it ever resolves

  getCachedImage.mockImplementation(async () => media());
  for (let i = 0; i < 300; i++) {
    const url = `https://example.com/filler-${i}.png`;
    await getStoredImageUrl(url); // stays retained, forcing eviction elsewhere
  }

  resolveLookup(media());
  const result = await oldestPromise;

  expect(result).toBeNull();
  expect(global.URL.revokeObjectURL).toHaveBeenCalledWith(
    expect.stringMatching(/^blob:/)
  );
});

it('clearStoredImageUrls revokes every url, including retained ones, and empties the map', async () => {
  const url = 'https://example.com/logout.png';
  getCachedImage.mockResolvedValue(media());

  const blobUrl = await getStoredImageUrl(url); // never released: still retained

  clearStoredImageUrls();

  expect(global.URL.revokeObjectURL).toHaveBeenCalledWith(blobUrl);

  getCachedImage.mockClear();
  await getStoredImageUrl(url);
  expect(getCachedImage).toHaveBeenCalledTimes(1);
});

it('drops a memoized miss for a url once it is cached', async () => {
  const url = 'https://example.com/now-cached.png';
  getCachedImage.mockResolvedValue(undefined);

  const miss = await getStoredImageUrl(url);
  releaseStoredImageUrl(url);
  expect(miss).toBeNull();

  dropStoredImageMiss(url);

  getCachedImage.mockResolvedValue(media());
  const hit = await getStoredImageUrl(url);
  releaseStoredImageUrl(url);

  expect(hit).toMatch(/^blob:/);
  expect(getCachedImage).toHaveBeenCalledTimes(2);
});

it('drops every memoized miss when the browser comes back online', async () => {
  const url = 'https://example.com/reconnect.png';
  getCachedImage.mockResolvedValue(undefined);

  await getStoredImageUrl(url);
  releaseStoredImageUrl(url);

  window.dispatchEvent(new Event('online'));

  getCachedImage.mockResolvedValue(media());
  await getStoredImageUrl(url);
  releaseStoredImageUrl(url);

  expect(getCachedImage).toHaveBeenCalledTimes(2);
});
