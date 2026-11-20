import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import Symbol from './Symbol';
import { getCachedImage, putCachedImage } from '../../../idb/media/imageCache';
import { clearStoredImageUrls } from '../../../idb/media/storedImageUrls';

// IndexedDB open + get resolve over several macrotasks, not just microtasks
const flush = () =>
  act(async () => await new Promise((resolve) => setTimeout(resolve, 50)));

// jsdom implements neither
let blobUrlCount = 0;

const srcOf = (wrapper) => wrapper.update().find('.Symbol__image').prop('src');
const imageCount = (wrapper) => wrapper.update().find('.Symbol__image').length;
const isHidden = (wrapper) =>
  wrapper.update().find('.Symbol__image').prop('style')?.visibility ===
  'hidden';

const setOnLine = (value) =>
  Object.defineProperty(window.navigator, 'onLine', {
    value,
    configurable: true
  });

beforeEach(() => {
  blobUrlCount = 0;
  global.URL.createObjectURL = jest.fn(() => `blob:test/${++blobUrlCount}`);
  global.URL.revokeObjectURL = jest.fn();
});

afterEach(() => {
  setOnLine(true);
  clearStoredImageUrls();
});

it('renders without crashing', () => {
  shallow(<Symbol label="dummy label" labelpos="Below" />);
});

it('renders with image', () => {
  const img = 'path/to/img.svg';
  const wrapper = mount(<Symbol label="dummy label" image={img} />);
  expect(wrapper.find('.Symbol__image')).toHaveLength(1);
});

it('renders with correct image source path', () => {
  const img = 'path/to/img.svg';
  const wrapper = mount(<Symbol label="dummy label" image={img} />);
  const symbolImage = wrapper.find('.Symbol__image');
  expect(symbolImage.prop('src')).toEqual(img);
});

it('keeps the url on screen and reads nothing while the image loads', async () => {
  const img = 'https://globalsymbols.com/rendered.png';
  await putCachedImage({
    url: img,
    type: 'image/png',
    data: new ArrayBuffer(8)
  });
  global.fetch = jest.fn();

  const wrapper = mount(<Symbol label="dummy label" image={img} />);
  wrapper.find('.Symbol__image').simulate('load');
  await flush();

  // a stored copy exists, but swapping the painted url for it would only flicker
  expect(srcOf(wrapper)).toEqual(img);
  expect(global.fetch).not.toHaveBeenCalled();
  wrapper.unmount();
});

it('caches remote images in IndexedDB when opted in', async () => {
  const img = 'https://globalsymbols.com/symbol.png';
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    headers: { get: () => 'image/png' },
    arrayBuffer: async () => new ArrayBuffer(4)
  });

  const wrapper = mount(
    <Symbol label="dummy label" image={img} cacheRemoteImage />
  );
  wrapper.find('.Symbol__image').simulate('load');
  await flush();

  expect(global.fetch).toHaveBeenCalledTimes(1);
  // caching happens off the render path: the painted url never changes
  expect(srcOf(wrapper)).toEqual(img);
  wrapper.unmount();

  expect(await getCachedImage(img)).toMatchObject({
    url: img,
    type: 'image/png'
  });
});

it('serves the cached copy when the image fails to load', async () => {
  const img = 'https://globalsymbols.com/offline.png';
  await putCachedImage({
    url: img,
    type: 'image/png',
    data: new ArrayBuffer(8)
  });
  global.fetch = jest.fn();

  const wrapper = mount(<Symbol label="dummy label" image={img} />);
  expect(srcOf(wrapper)).toEqual(img);

  wrapper.find('.Symbol__image').simulate('error');
  await flush();

  expect(srcOf(wrapper)).toMatch(/^blob:/);
  expect(global.fetch).not.toHaveBeenCalled();
  wrapper.unmount();
});

it('takes a failed image off screen when nothing is stored', async () => {
  const img = 'https://globalsymbols.com/missing.png';
  global.fetch = jest.fn();

  const wrapper = mount(<Symbol label="dummy label" image={img} />);
  wrapper.find('.Symbol__image').simulate('error');
  await flush();

  expect(imageCount(wrapper)).toEqual(0);
  wrapper.unmount();
});

it('does not hide an image that can reach the network', () => {
  const img = 'https://globalsymbols.com/online.png';

  const wrapper = mount(<Symbol label="dummy label" image={img} />);

  expect(isHidden(wrapper)).toBe(false);
  wrapper.unmount();
});

it('hides a remote image offline until it loads', () => {
  const img = 'https://globalsymbols.com/offline-hit.png';
  setOnLine(false);

  const wrapper = mount(<Symbol label="dummy label" image={img} />);
  expect(srcOf(wrapper)).toEqual(img);
  expect(isHidden(wrapper)).toBe(true);

  wrapper.find('.Symbol__image').simulate('load');

  expect(srcOf(wrapper)).toEqual(img);
  expect(isHidden(wrapper)).toBe(false);
  wrapper.unmount();
});

it('never shows a remote image offline that has to come from storage', async () => {
  const img = 'https://globalsymbols.com/offline-miss.png';
  await putCachedImage({
    url: img,
    type: 'image/png',
    data: new ArrayBuffer(8)
  });
  global.fetch = jest.fn();
  setOnLine(false);

  const wrapper = mount(<Symbol label="dummy label" image={img} />);
  expect(isHidden(wrapper)).toBe(true);

  wrapper.find('.Symbol__image').simulate('error');
  await flush();

  expect(srcOf(wrapper)).toMatch(/^blob:/);
  expect(isHidden(wrapper)).toBe(false);
  wrapper.unmount();
});

it('takes a failed image off screen offline when nothing is stored', async () => {
  const img = 'https://globalsymbols.com/offline-broken.png';
  global.fetch = jest.fn();
  setOnLine(false);

  const wrapper = mount(<Symbol label="dummy label" image={img} />);
  wrapper.find('.Symbol__image').simulate('error');
  await flush();

  expect(imageCount(wrapper)).toEqual(0);
  wrapper.unmount();
});

it('keeps a local image on screen while offline', () => {
  const img = '/symbols/mulberry/apple.svg';
  setOnLine(false);

  const wrapper = mount(<Symbol label="dummy label" image={img} />);

  expect(srcOf(wrapper)).toEqual(img);
  expect(isHidden(wrapper)).toBe(false);
  wrapper.unmount();
});

it('does not cache remote images by default', async () => {
  const img = 'https://globalsymbols.com/suggestion.png';
  global.fetch = jest.fn();

  const wrapper = mount(<Symbol label="dummy label" image={img} />);
  wrapper.find('.Symbol__image').simulate('load');
  await flush();

  expect(global.fetch).not.toHaveBeenCalled();
  expect(await getCachedImage(img)).toBeUndefined();
  expect(srcOf(wrapper)).toEqual(img);
  wrapper.unmount();
});

it('drops the cached copy as soon as the image prop changes', async () => {
  const cached = 'https://globalsymbols.com/first.png';
  const next = 'https://globalsymbols.com/second.png';
  await putCachedImage({
    url: cached,
    type: 'image/png',
    data: new ArrayBuffer(8)
  });
  global.fetch = jest.fn();

  const wrapper = mount(<Symbol label="dummy label" image={cached} />);
  wrapper.find('.Symbol__image').simulate('error');
  await flush();
  expect(srcOf(wrapper)).toMatch(/^blob:/);

  wrapper.setProps({ image: next });
  expect(srcOf(wrapper)).toEqual(next);
  wrapper.unmount();
});

it('does not cache captive portal responses', async () => {
  const img = 'https://globalsymbols.com/portal.png';
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    headers: { get: () => 'text/html; charset=utf-8' },
    arrayBuffer: async () => new ArrayBuffer(4)
  });

  const wrapper = mount(
    <Symbol label="dummy label" image={img} cacheRemoteImage />
  );
  wrapper.find('.Symbol__image').simulate('load');
  await flush();
  wrapper.unmount();

  expect(await getCachedImage(img)).toBeUndefined();
});

it('renders with label', () => {
  const wrapper = shallow(
    <Symbol label="dummy label" type="p" labelpos="Below" />
  );
  expect(wrapper.find('.Symbol__label')).toHaveLength(1);
});

it('reuses the memoized blob url across mounts without revoking on unmount', async () => {
  const img = 'https://globalsymbols.com/reused-across-mounts.png';
  await putCachedImage({
    url: img,
    type: 'image/png',
    data: new ArrayBuffer(8)
  });

  const first = mount(<Symbol label="dummy label" image={img} />);
  first.find('.Symbol__image').simulate('error');
  await flush();

  const firstBlobUrl = srcOf(first);
  expect(firstBlobUrl).toBe('blob:test/1');
  expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1);

  first.unmount();
  expect(global.URL.revokeObjectURL).not.toHaveBeenCalled();

  const second = mount(<Symbol label="dummy label" image={img} />);
  second.find('.Symbol__image').simulate('error');
  await flush();

  expect(srcOf(second)).toBe(firstBlobUrl);
  expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1);
  second.unmount();
  expect(global.URL.revokeObjectURL).not.toHaveBeenCalled();
});

it('collapses two tiles failing in one tick into one object url', async () => {
  const img = 'https://globalsymbols.com/shared-tick.png';
  await putCachedImage({
    url: img,
    type: 'image/png',
    data: new ArrayBuffer(8)
  });

  const wrapper = mount(
    <div>
      <Symbol label="first" image={img} />
      <Symbol label="second" image={img} />
    </div>
  );

  wrapper.find('.Symbol__image').forEach((node) => node.simulate('error'));
  await flush();

  const images = wrapper.update().find('.Symbol__image');
  expect(images).toHaveLength(2);
  expect(images.at(0).prop('src')).toBe('blob:test/1');
  expect(images.at(1).prop('src')).toBe('blob:test/1');
  expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1);

  wrapper.unmount();
  expect(global.URL.revokeObjectURL).not.toHaveBeenCalled();
});

it('repaints a blank tile on an online event and caches it for the next offline mount', async () => {
  const img = 'https://globalsymbols.com/online-recovery.png';
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    headers: { get: () => 'image/png' },
    arrayBuffer: async () => new ArrayBuffer(8)
  });
  setOnLine(false);

  const wrapper = mount(
    <Symbol label="dummy label" image={img} cacheRemoteImage />
  );
  wrapper.find('.Symbol__image').simulate('error');
  await flush();
  expect(imageCount(wrapper)).toBe(0);

  setOnLine(true);
  act(() => {
    window.dispatchEvent(new Event('online'));
  });

  expect(srcOf(wrapper)).toBe(img);
  expect(isHidden(wrapper)).toBe(false);

  wrapper.find('.Symbol__image').simulate('load');
  await flush();
  wrapper.unmount();

  setOnLine(false);
  const offlineMount = mount(<Symbol label="dummy label" image={img} />);
  offlineMount.find('.Symbol__image').simulate('error');
  await flush();

  expect(srcOf(offlineMount)).toBe('blob:test/1');
  offlineMount.unmount();
});
