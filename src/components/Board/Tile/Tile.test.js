import React from 'react';
import { shallow, mount } from 'enzyme';
import { Scannable } from 'react-scannable';

import Symbol from '../Symbol';
import Tile from './Tile.component';

it('renders without crashing', () => {
  const wrapper = shallow(<Tile />);
  expect(wrapper).toMatchSnapshot();
});

it('renders with button child', () => {
  const wrapper = mount(<Tile />);
  expect(wrapper.find('button')).toHaveLength(1);
});

it('renders with <Scannable /> child', () => {
  const props = {
    label: 'dummy label',
    img: 'path/to/img.svg'
  };
  const wrapper = mount(<Tile {...props} />);
  const scannable = wrapper.find(Scannable);
  expect(scannable.length).toEqual(1);
});

it('renders with a folder className', () => {
  const folderClassName = 'Tile--folder';
  const props = {
    variant: 'folder'
  };
  const wrapper = mount(<Tile {...props} />);
  expect(wrapper.find('button').hasClass(folderClassName)).toEqual(true);
});

it('Tile is a stateless functional component', () => {
  const wrapper = shallow(<Tile />);
  const instance = wrapper.instance();
  expect(instance).toEqual(null);
});

it('on tile focus', () => {
  const props = {
    id: '42',
    onFocus: jest.fn()
  };
  const wrapper = shallow(<Tile {...props} />);
  wrapper.find('button').simulate('focus');
  expect(props.onFocus.mock.calls.length).toEqual(1);
});

it('on tile click', () => {
  const props = {
    id: '42',
    variant: 'button',
    onClick: jest.fn()
  };
  const wrapper = shallow(<Tile {...props} />);
  wrapper.find('button').simulate('click');
  expect(props.onClick.mock.calls.length).toEqual(1);
});

it('on tile select', () => {
  const props = {
    id: '42',
    variant: 'button',
    onSelect: jest.fn()
  };
  const wrapper = shallow(<Tile {...props} />);
  wrapper.find('#scannable').prop('onSelect')();
});

it('on tile folder select', () => {
  const props = {
    id: '42',
    variant: 'folder',
    onSelect: jest.fn()
  };
  const scanner = {
    reset: jest.fn()
  };
  const wrapper = shallow(<Tile {...props} />);
  wrapper.find('#scannable').prop('onSelect')({}, {}, scanner);
});

it('on tile click and props', () => {
  const props = {
    id: '42',
    variant: 'button',
    borderColor: '#fffff',
    backgroundColor: '#fffff',
    variant: 'folder',
    onClick: jest.fn(),
    onSelect: jest.fn()
  };
  const wrapper = shallow(<Tile {...props} />);
});
