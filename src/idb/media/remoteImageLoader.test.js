import { getCachedImage, putCachedImage } from './imageCache';
import { storeRemoteImage } from './remoteImageLoader';

jest.mock('./imageCache', () => ({
  getCachedImage: jest.fn(),
  putCachedImage: jest.fn()
}));

const image = (url = 'https://example.com/symbol.png') => ({
  url,
  type: 'image/png',
  data: new ArrayBuffer(4)
});

const okResponse = (type = 'image/png', data = new ArrayBuffer(4)) => ({
  ok: true,
  status: 200,
  headers: { get: () => type },
  arrayBuffer: async () => data
});

const errorResponse = (status) => ({
  ok: false,
  status,
  headers: { get: () => 'text/html' },
  arrayBuffer: async () => new ArrayBuffer(0)
});

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
  Object.defineProperty(window.navigator, 'onLine', {
    configurable: true,
    value: true
  });
});

it('fetches and stores an image that is not cached yet', async () => {
  const fetched = image('https://example.com/store.png');
  getCachedImage.mockResolvedValue(undefined);
  global.fetch.mockResolvedValue(okResponse(fetched.type, fetched.data));

  await storeRemoteImage(fetched.url);

  expect(global.fetch).toHaveBeenCalledWith(fetched.url);
  expect(putCachedImage).toHaveBeenCalledWith({
    url: fetched.url,
    type: fetched.type,
    data: fetched.data
  });
});

it('skips the IndexedDB read once a url has been handled', async () => {
  const url = 'https://example.com/known.png';
  getCachedImage.mockResolvedValue(undefined);
  global.fetch.mockResolvedValue(okResponse());

  await storeRemoteImage(url);
  await storeRemoteImage(url);

  expect(getCachedImage).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenCalledTimes(1);
});

it('does not re-fetch a url already in the store', async () => {
  const cached = image('https://example.com/already.png');
  getCachedImage.mockResolvedValue(cached);

  await storeRemoteImage(cached.url);

  expect(global.fetch).not.toHaveBeenCalled();
  expect(putCachedImage).not.toHaveBeenCalled();
});

it('does not store an unreadable response and retries on a later call', async () => {
  const url = 'https://example.com/retry.png';
  getCachedImage.mockResolvedValue(undefined);
  global.fetch
    .mockRejectedValueOnce(new TypeError('Failed to fetch'))
    .mockResolvedValueOnce(okResponse());

  await storeRemoteImage(url);
  expect(putCachedImage).not.toHaveBeenCalled();

  await storeRemoteImage(url);
  expect(putCachedImage).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenCalledTimes(2);
});

it('does not store a captive portal response', async () => {
  const url = 'https://example.com/portal.png';
  getCachedImage.mockResolvedValue(undefined);
  global.fetch.mockResolvedValue(okResponse('text/html; charset=utf-8'));

  await storeRemoteImage(url);

  expect(putCachedImage).not.toHaveBeenCalled();
});

it('stores the image once the captive portal lets the request through', async () => {
  const url = 'https://example.com/signed-in.png';
  getCachedImage.mockResolvedValue(undefined);
  global.fetch
    .mockResolvedValueOnce(okResponse('text/html; charset=utf-8'))
    .mockResolvedValueOnce(okResponse());

  await storeRemoteImage(url);
  expect(putCachedImage).not.toHaveBeenCalled();

  await storeRemoteImage(url);
  expect(putCachedImage).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenCalledTimes(2);
});

it('retries a url that failed with a transient server error', async () => {
  const url = 'https://example.com/busy.png';
  getCachedImage.mockResolvedValue(undefined);
  global.fetch
    .mockResolvedValueOnce(errorResponse(503))
    .mockResolvedValueOnce(okResponse());

  await storeRemoteImage(url);
  expect(putCachedImage).not.toHaveBeenCalled();

  await storeRemoteImage(url);
  expect(putCachedImage).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenCalledTimes(2);
});

it('does not retry a url the server says is not there', async () => {
  const url = 'https://example.com/gone.png';
  getCachedImage.mockResolvedValue(undefined);
  global.fetch.mockResolvedValue(errorResponse(404));

  await storeRemoteImage(url);
  await storeRemoteImage(url);

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(putCachedImage).not.toHaveBeenCalled();
});

it('does not fetch while offline', async () => {
  getCachedImage.mockResolvedValue(undefined);
  Object.defineProperty(window.navigator, 'onLine', {
    configurable: true,
    value: false
  });

  await storeRemoteImage('https://example.com/offline.png');

  expect(global.fetch).not.toHaveBeenCalled();
  expect(getCachedImage).not.toHaveBeenCalled();
});

it('shares one fetch and one cache write for concurrent misses', async () => {
  const url = 'https://example.com/shared.png';
  const data = new ArrayBuffer(4);
  getCachedImage.mockResolvedValue(undefined);
  let resolveFetch;
  global.fetch.mockReturnValue(
    new Promise((resolve) => {
      resolveFetch = resolve;
    })
  );

  const first = storeRemoteImage(url);
  const second = storeRemoteImage(url);
  resolveFetch(okResponse('image/png', data));
  await Promise.all([first, second]);

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(putCachedImage).toHaveBeenCalledTimes(1);
});
