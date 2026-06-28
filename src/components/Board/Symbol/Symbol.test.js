import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import Symbol from './Symbol';
import {
  getCachedImage,
  putCachedImage
} from '../../../idb/imageCache/imageCache';

// IndexedDB open + get resolve over several macrotasks, not just microtasks
const flush = () =>
  act(async () => await new Promise((resolve) => setTimeout(resolve, 50)));

// jsdom implements neither
let blobUrlCount = 0;
global.URL.createObjectURL = () => `blob:test/${++blobUrlCount}`;
global.URL.revokeObjectURL = () => {};

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
  await flush();
  wrapper.unmount();

  expect(global.fetch).toHaveBeenCalledWith(img, { cache: 'force-cache' });
  expect(await getCachedImage(img)).toMatchObject({
    url: img,
    type: 'image/png'
  });
});

it('does not cache remote images by default', async () => {
  const img = 'https://globalsymbols.com/suggestion.png';
  global.fetch = jest.fn();

  const wrapper = mount(<Symbol label="dummy label" image={img} />);
  await flush();

  expect(global.fetch).not.toHaveBeenCalled();
  expect(await getCachedImage(img)).toBeUndefined();
  expect(wrapper.find('.Symbol__image').prop('src')).toEqual(img);
  wrapper.unmount();
});

it('serves an already cached image even without opting in', async () => {
  const img = 'https://globalsymbols.com/previously-cached.png';
  await putCachedImage({
    url: img,
    type: 'image/png',
    data: new ArrayBuffer(8)
  });
  global.fetch = jest.fn();

  const wrapper = mount(<Symbol label="dummy label" image={img} />);
  await flush();

  expect(global.fetch).not.toHaveBeenCalled();
  expect(wrapper.update().find('.Symbol__image').prop('src')).toMatch(/^blob:/);
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
