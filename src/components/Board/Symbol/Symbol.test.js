import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import Symbol from './Symbol';
import { getCachedImage, putCachedImage } from '../../../idb/media/imageCache';
import { clearStoredImageUrls } from '../../../idb/media/storedImageUrls';

// IndexedDB open + get resolve over several macrotasks, not just microtasks
const flush = () =>
  act(async () => await new Promise((resolve) => setTimeout(resolve, 50)));

// jsdom implements neither. Reassigned fresh each test (rather than once at
// module scope) because CRA's jest preset resets mock state -- including a
// plain jest.fn's implementation -- before every test.
let blobUrlCount;

beforeEach(() => {
  blobUrlCount = 0;
  global.URL.createObjectURL = jest.fn(() => `blob:test/${++blobUrlCount}`);
  global.URL.revokeObjectURL = jest.fn();
});

afterEach(() => {
  clearStoredImageUrls();
});

const srcOf = (wrapper) => wrapper.update().find('.Symbol__image').prop('src');

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

it('hides the tile when a failed image is not cached', async () => {
  const img = 'https://globalsymbols.com/missing.png';
  global.fetch = jest.fn();

  const wrapper = mount(<Symbol label="dummy label" image={img} />);
  wrapper.find('.Symbol__image').simulate('error');
  await flush();

  // nothing to fall back to, and the src will never change again on its own,
  // so a broken icon would stay broken forever: hide it instead
  expect(wrapper.update().find('.Symbol__image')).toHaveLength(0);
  wrapper.unmount();
});

it('hides the tile after a repeatedly failing image with nothing stored', async () => {
  const img = 'https://globalsymbols.com/broken.png';
  global.fetch = jest.fn();

  const wrapper = mount(<Symbol label="dummy label" image={img} />);
  const image = wrapper.find('.Symbol__image');
  image.simulate('error');
  image.simulate('error');
  await flush();

  expect(wrapper.update().find('.Symbol__image')).toHaveLength(0);
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

it('reuses the memoized blob url across a remount of the same tile', async () => {
  const img = 'https://globalsymbols.com/remount.png';
  await putCachedImage({
    url: img,
    type: 'image/png',
    data: new ArrayBuffer(8)
  });
  global.fetch = jest.fn();

  const first = mount(<Symbol label="dummy label" image={img} />);
  first.find('.Symbol__image').simulate('error');
  await flush();
  const firstSrc = srcOf(first);
  expect(firstSrc).toMatch(/^blob:/);
  first.unmount();

  // released, not revoked: the same lookup should not run again
  expect(global.URL.revokeObjectURL).not.toHaveBeenCalled();
  global.URL.createObjectURL.mockClear();

  const second = mount(<Symbol label="dummy label" image={img} />);
  second.find('.Symbol__image').simulate('error');
  await flush();

  expect(srcOf(second)).toEqual(firstSrc);
  expect(global.URL.createObjectURL).not.toHaveBeenCalled();
  second.unmount();
});

it('collapses two tiles sharing a url in one tick into a single blob url', async () => {
  const img = 'https://globalsymbols.com/shared-tick.png';
  await putCachedImage({
    url: img,
    type: 'image/png',
    data: new ArrayBuffer(8)
  });
  global.fetch = jest.fn();

  const a = mount(<Symbol label="a" image={img} />);
  const b = mount(<Symbol label="b" image={img} />);
  a.find('.Symbol__image').simulate('error');
  b.find('.Symbol__image').simulate('error');
  await flush();

  expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1);
  const blobSrc = srcOf(a);
  expect(blobSrc).toMatch(/^blob:/);
  expect(srcOf(b)).toEqual(blobSrc);

  a.unmount();
  expect(global.URL.revokeObjectURL).not.toHaveBeenCalled();

  expect(srcOf(b)).toEqual(blobSrc);
  b.unmount();

  // both tiles released, but nothing evicted it yet: still nothing to revoke
  expect(global.URL.revokeObjectURL).not.toHaveBeenCalled();
});

it('drops a memoized miss and repaints a blank tile once back online', async () => {
  const img = 'https://globalsymbols.com/reconnect.png';
  global.fetch = jest.fn();

  const wrapper = mount(<Symbol label="dummy label" image={img} />);
  wrapper.find('.Symbol__image').simulate('error');
  await flush();

  // nothing stored: the tile goes blank
  expect(wrapper.update().find('.Symbol__image')).toHaveLength(0);

  await act(async () => {
    window.dispatchEvent(new Event('online'));
  });

  expect(srcOf(wrapper)).toEqual(img);
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
