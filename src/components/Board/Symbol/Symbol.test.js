import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import Symbol from './Symbol';
import { getCachedImage, putCachedImage } from '../../../idb/media/imageCache';

// IndexedDB open + get resolve over several macrotasks, not just microtasks
const flush = () =>
  act(async () => await new Promise((resolve) => setTimeout(resolve, 50)));

// jsdom implements neither
let blobUrlCount = 0;
global.URL.createObjectURL = () => `blob:test/${++blobUrlCount}`;
global.URL.revokeObjectURL = () => {};

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

it('keeps the network url when a failed image is not cached', async () => {
  const img = 'https://globalsymbols.com/missing.png';
  global.fetch = jest.fn();

  const wrapper = mount(<Symbol label="dummy label" image={img} />);
  wrapper.find('.Symbol__image').simulate('error');
  await flush();

  expect(srcOf(wrapper)).toEqual(img);
  wrapper.unmount();
});

it('keeps the url when a repeatedly failing image has nothing stored', async () => {
  const img = 'https://globalsymbols.com/broken.png';
  global.fetch = jest.fn();

  const wrapper = mount(<Symbol label="dummy label" image={img} />);
  const image = wrapper.find('.Symbol__image');
  image.simulate('error');
  image.simulate('error');
  await flush();

  expect(srcOf(wrapper)).toEqual(img);
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
