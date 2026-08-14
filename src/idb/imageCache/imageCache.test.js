import { IDBFactory } from 'fake-indexeddb';

const KB = 1024;
const MB = 1024 * KB;
const GB = 1024 * MB;

// only byteLength is read and stored, so skip allocating the real thing
const image = (url, bytes = KB) => ({
  url,
  type: 'image/png',
  data: { byteLength: bytes }
});

let cache;

beforeEach(() => {
  global.indexedDB = new IDBFactory();
  jest.resetModules();
  cache = require('./imageCache');
});

afterEach(() => {
  delete navigator.storage;
});

const withEstimate = (estimate) => {
  Object.defineProperty(navigator, 'storage', {
    value: { estimate: async () => estimate },
    configurable: true
  });
};

it('caches when the storage manager is unavailable', async () => {
  const img = image('https://example.com/no-storage-manager.png');

  await cache.putCachedImage(img);

  expect(await cache.getCachedImage(img.url)).toMatchObject({ url: img.url });
});

it('caches while under the budget', async () => {
  const img = image('https://example.com/under-budget.png');
  withEstimate({ quota: 10 * GB, usage: 0 });

  await cache.putCachedImage(img);

  expect(await cache.getCachedImage(img.url)).toMatchObject({ url: img.url });
});

it('stops caching once the cache reaches the share of quota', async () => {
  // 10% of 10MB is 1MB
  withEstimate({ quota: 10 * MB, usage: 0 });

  await cache.putCachedImage(image('https://example.com/fills-share.png', MB));
  await cache.putCachedImage(image('https://example.com/over-share.png'));

  expect(
    await cache.getCachedImage('https://example.com/over-share.png')
  ).toBeUndefined();
});

it('stops caching at the absolute cap without a storage manager', async () => {
  await cache.putCachedImage(
    image('https://example.com/fills-cap.png', 250 * MB)
  );
  await cache.putCachedImage(image('https://example.com/over-cap.png'));

  expect(
    await cache.getCachedImage('https://example.com/over-cap.png')
  ).toBeUndefined();
});

it('stops caching at the absolute cap on a roomy device', async () => {
  withEstimate({ quota: 500 * GB, usage: 0 });

  await cache.putCachedImage(
    image('https://example.com/fills-roomy-cap.png', 250 * MB)
  );
  await cache.putCachedImage(image('https://example.com/over-roomy-cap.png'));

  expect(
    await cache.getCachedImage('https://example.com/over-roomy-cap.png')
  ).toBeUndefined();
});

it('counts its own bytes, not the rest of the origin', async () => {
  const img = image('https://example.com/other-origin-usage.png');
  // boards and everything else already past the 250MB cap
  withEstimate({ quota: 500 * GB, usage: 300 * MB });

  await cache.putCachedImage(img);

  expect(await cache.getCachedImage(img.url)).toMatchObject({ url: img.url });
});

it('counts a re-cached url once', async () => {
  // 10% of 10MB is 1MB
  withEstimate({ quota: 10 * MB, usage: 0 });
  const img = image('https://example.com/recached.png', 600 * KB);

  await cache.putCachedImage(img);
  await cache.putCachedImage(img);
  await cache.putCachedImage(
    image('https://example.com/after-recache.png', 300 * KB)
  );

  expect(
    await cache.getCachedImage('https://example.com/after-recache.png')
  ).toMatchObject({ url: 'https://example.com/after-recache.png' });
});

it('warns only once when the budget blocks writes', async () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  withEstimate({ quota: 10 * MB, usage: 0 });

  await cache.putCachedImage(image('https://example.com/warn-a.png', 2 * MB));
  await cache.putCachedImage(image('https://example.com/warn-b.png', 2 * MB));

  expect(warn).toHaveBeenCalledTimes(1);
  warn.mockRestore();
});
