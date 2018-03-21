import React from 'react';
import { mount } from 'enzyme';
import SelectedCounter from './SelectedCounter.component';

it('renders without crashing', () => {
  mount(<SelectedCounter />);
});

it('renders with defaultProps', () => {
  const wrapper = mount(<SelectedCounter />);
  expect(wrapper.prop('count')).toEqual(0);
  expect(wrapper.prop('text')).toEqual('items selected');
});

it('renders with props', () => {
  const wrapper = mount(<SelectedCounter count={1} text="abcd" />);

  expect(wrapper.prop('count')).toEqual(1);
  expect(wrapper.prop('text')).toEqual('abcd');
});
