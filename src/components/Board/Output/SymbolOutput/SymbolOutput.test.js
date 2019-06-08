import React from 'react';
import { shallow, mount } from 'enzyme';
import { Scannable } from 'react-scannable';

import SymbolOutput from './SymbolOutput';
import ClearButton from './ClearButton';
import BackspaceButton from './BackspaceButton';
import Scroll from './Scroll';

it('renders without crashing', () => {
  shallow(<SymbolOutput />);
});

it('renders with <Scroll />', () => {
  const wrapper = mount(<SymbolOutput />);
  expect(wrapper.find(Scroll)).toHaveLength(1);
});

it('renders with <ClearButton />', () => {
  const wrapper = mount(<SymbolOutput />);
  expect(wrapper.find(ClearButton)).toHaveLength(1);
});

it('renders with <BackspaceButton />', () => {
  const wrapper = mount(<SymbolOutput />);
  expect(wrapper.find(BackspaceButton)).toHaveLength(1);
});
