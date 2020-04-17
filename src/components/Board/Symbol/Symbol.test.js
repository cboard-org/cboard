import React from 'react';
import { shallow } from 'enzyme';
import Symbol from './Symbol';

it('renders without crashing', () => {
  shallow(<Symbol label="dummy label" labelpos="Below" />);
});

it('renders with image', () => {
  const img = 'path/to/img.svg';
  const wrapper = shallow(<Symbol label="dummy label" image={img} />);
  expect(wrapper.find('.Symbol__image')).toHaveLength(1);
});

it('renders with correct image source path', () => {
  const img = 'path/to/img.svg';
  const wrapper = shallow(<Symbol label="dummy label" image={img} />);
  const symbolImage = wrapper.find('.Symbol__image');
  expect(symbolImage.prop('src')).toEqual(img);
});

it('renders with label', () => {
  const wrapper = shallow(<Symbol label="dummy label" labelpos="Below" />);
  expect(wrapper.find('.Symbol__label')).toHaveLength(1);
});
