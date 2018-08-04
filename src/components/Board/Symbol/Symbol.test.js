import React from 'react';
import { shallow } from 'enzyme';
import Symbol from './Symbol.component';

it('renders without crashing', () => {
  shallow(<Symbol />);
});

it('renders with image', () => {
  const src = 'path/to/img.svg';
  const wrapper = shallow(<Symbol image={src} />);

  expect(wrapper.find('.Symbol__image')).toHaveLength(1);
});

it('renders with correct image source path', () => {
  const src = 'path/to/img.svg';
  const wrapper = shallow(<Symbol image={src} />);
  const symbolImage = wrapper.find('.Symbol__image');

  expect(symbolImage.prop('src')).toEqual(src);
});

it('renders with label', () => {
  const wrapper = shallow(<Symbol label="dummy label" />);

  expect(wrapper.find('.Symbol__label')).toHaveLength(1);
});
