import { getCachedImage, putCachedImage } from './imageCache';

const image = (url) => ({
  url,
  type: 'image/png',
  data: new ArrayBuffer(1024)
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

  await putCachedImage(img);

  expect(await getCachedImage(img.url)).toMatchObject({ url: img.url });
});

it('caches while under the budget', async () => {
  const img = image('https://example.com/under-budget.png');
  withEstimate({ quota: 10 * 1024 * 1024 * 1024, usage: 0 });

  await putCachedImage(img);

  expect(await getCachedImage(img.url)).toMatchObject({ url: img.url });
});

it('stops caching once usage reaches the share of quota', async () => {
  const img = image('https://example.com/over-quota-share.png');
  // 10% of 10MB is 1MB, already used
  withEstimate({ quota: 10 * 1024 * 1024, usage: 1024 * 1024 });

  await putCachedImage(img);

  expect(await getCachedImage(img.url)).toBeUndefined();
});

it('stops caching once usage reaches the absolute cap', async () => {
  const img = image('https://example.com/over-absolute-cap.png');
  // quota is huge, so the 250MB cap is what binds
  withEstimate({ quota: 500 * 1024 * 1024 * 1024, usage: 250 * 1024 * 1024 });

  await putCachedImage(img);

  expect(await getCachedImage(img.url)).toBeUndefined();
});

it('still caches below the raised cap on a roomy device', async () => {
  const img = image('https://example.com/under-raised-cap.png');
  // 100MB used of a 500GB quota: over the old 50MB cap, under the new one
  withEstimate({ quota: 500 * 1024 * 1024 * 1024, usage: 100 * 1024 * 1024 });

  await putCachedImage(img);

  expect(await getCachedImage(img.url)).toMatchObject({ url: img.url });
});

it('warns only once when the budget blocks writes', async () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  withEstimate({ quota: 10 * 1024 * 1024, usage: 1024 * 1024 });

  // the warned-once flag is module state, so start from a fresh module
  jest.resetModules();
  const cache = require('./imageCache');

  await cache.putCachedImage(image('https://example.com/warn-a.png'));
  await cache.putCachedImage(image('https://example.com/warn-b.png'));

  expect(warn).toHaveBeenCalledTimes(1);
  warn.mockRestore();
});
