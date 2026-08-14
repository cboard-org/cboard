import { IDBFactory } from 'fake-indexeddb';

const TOUCH_AFTER_MS = 24 * 60 * 60 * 1000;
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
let now;

beforeEach(() => {
  global.indexedDB = new IDBFactory();
  jest.resetModules();
  cache = require('./imageCache');
  // eviction order needs distinct timestamps, real ones tie within a test
  now = 1000;
  jest.spyOn(Date, 'now').mockImplementation(() => (now += 1000));
});

afterEach(() => {
  delete navigator.storage;
  jest.restoreAllMocks();
});

const withEstimate = (estimate) => {
  Object.defineProperty(navigator, 'storage', {
    value: { estimate: async () => estimate },
    configurable: true
  });
};

// 10% of a 10MB quota is a 1024KB budget; going over it evicts down to 95% of
// that, ~973KB
const withSmallBudget = () => withEstimate({ quota: 10 * MB, usage: 0 });

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

it('counts its own bytes, not the rest of the origin', async () => {
  const img = image('https://example.com/other-origin-usage.png');
  // boards and everything else already past the 250MB cap
  withEstimate({ quota: 500 * GB, usage: 300 * MB });

  await cache.putCachedImage(img);

  expect(await cache.getCachedImage(img.url)).toMatchObject({ url: img.url });
});

it('counts a re-cached url once', async () => {
  withSmallBudget();
  const img = image('https://example.com/recached.png', 600 * KB);

  await cache.putCachedImage(img);
  await cache.putCachedImage(img);
  await cache.putCachedImage(image('https://example.com/kept.png', 300 * KB));

  // counting the second put as new would total 1500KB, over budget, and evict
  // this url as the oldest entry
  expect(await cache.getCachedImage(img.url)).toMatchObject({ url: img.url });
});

it('evicts the least recently used image when full', async () => {
  withSmallBudget();

  // the third put totals 1200KB, over the 1024KB budget; dropping one 400KB
  // image reaches the ~973KB mark, so only the oldest goes
  await cache.putCachedImage(image('https://example.com/oldest.png', 400 * KB));
  await cache.putCachedImage(image('https://example.com/newer.png', 400 * KB));
  await cache.putCachedImage(image('https://example.com/newest.png', 400 * KB));

  expect(
    await cache.getCachedImage('https://example.com/oldest.png')
  ).toBeUndefined();
  expect(
    await cache.getCachedImage('https://example.com/newer.png')
  ).toBeDefined();
  expect(
    await cache.getCachedImage('https://example.com/newest.png')
  ).toBeDefined();
});

it('evicts down to the low water mark, not just under the budget', async () => {
  withSmallBudget();

  // 10 x 100KB sits just under the 1024KB budget
  for (let i = 0; i < 10; i++) {
    await cache.putCachedImage(
      image(`https://example.com/fill-${i}.png`, 100 * KB)
    );
  }
  await cache.putCachedImage(
    image('https://example.com/trigger.png', 100 * KB)
  );

  // 1100KB now: one eviction leaves 1000KB, back under the budget but still
  // over the ~973KB mark, so a second goes too
  expect(
    await cache.getCachedImage('https://example.com/fill-0.png')
  ).toBeUndefined();
  expect(
    await cache.getCachedImage('https://example.com/fill-1.png')
  ).toBeUndefined();
  expect(
    await cache.getCachedImage('https://example.com/fill-2.png')
  ).toBeDefined();
});

it('reading an image protects it from the next eviction', async () => {
  withSmallBudget();
  await cache.putCachedImage(image('https://example.com/read.png', 400 * KB));
  await cache.putCachedImage(image('https://example.com/unread.png', 400 * KB));

  // a read only rewrites lastUsed once the entry is a day old
  now += TOUCH_AFTER_MS;
  await cache.getCachedImage('https://example.com/read.png');
  await cache.putCachedImage(image('https://example.com/new.png', 400 * KB));

  expect(
    await cache.getCachedImage('https://example.com/read.png')
  ).toBeDefined();
  expect(
    await cache.getCachedImage('https://example.com/unread.png')
  ).toBeUndefined();
});

it('skips an image larger than the whole budget', async () => {
  withSmallBudget();
  const img = image('https://example.com/huge.png', 2 * MB);
  await cache.putCachedImage(image('https://example.com/kept.png', 400 * KB));

  await cache.putCachedImage(img);

  expect(await cache.getCachedImage(img.url)).toBeUndefined();
  // an oversized image must not empty the cache on its way to not fitting
  expect(
    await cache.getCachedImage('https://example.com/kept.png')
  ).toBeDefined();
});

it('enforces the absolute cap without a storage manager', async () => {
  // no estimate to lower it, so the budget is the 250MB cap
  await cache.putCachedImage(
    image('https://example.com/fills-cap.png', 250 * MB)
  );
  await cache.putCachedImage(image('https://example.com/trigger.png', 10 * MB));

  expect(
    await cache.getCachedImage('https://example.com/fills-cap.png')
  ).toBeUndefined();
  expect(
    await cache.getCachedImage('https://example.com/trigger.png')
  ).toBeDefined();
});

it('warns only once when eviction starts', async () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  withSmallBudget();

  // 4 x 400KB goes over budget twice, on the third put and again on the fourth
  for (let i = 0; i < 4; i++) {
    await cache.putCachedImage(
      image(`https://example.com/warn-${i}.png`, 400 * KB)
    );
  }

  expect(warn).toHaveBeenCalledTimes(1);
  warn.mockRestore();
});
