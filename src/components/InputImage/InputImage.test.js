import React from 'react';
import { shallow } from 'enzyme';

import InputImage from './InputImage';

it('renders without crashing', () => {
  const props = {
    onChange: () => {}
  };
  shallow(<InputImage {...props} />);
});

it('renders with label', () => {
  const props = {
    onChange: () => {}
  };
  const wrapper = shallow(<InputImage {...props} />);
  expect(wrapper.find('.InputImage__label').length).toEqual(1);
});

it('renders with image', () => {
  const props = {
    image: 'path/to/img.svg'
  };
  const wrapper = shallow(<InputImage {...props} />);
  const img = wrapper.find('.InputImage__img');
  expect(img.length).toEqual(1);
  expect(img.props().src).toEqual(props.image);
});
