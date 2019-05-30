import React from 'react';
import { shallow, mount } from 'enzyme';
import { Scannable } from 'react-scannable';

import Symbol from '../Symbol';
import Tile from './Tile.component';

it('renders without crashing', () => {
  shallow(<Tile />);
});

it('renders with button child', () => {
  const wrapper = mount(<Tile />);
  expect(wrapper.find('button')).toHaveLength(1);
});

it('renders with <Scannable /> child and props', () => {
  const props = {
    label: 'dummy label',
    img: 'path/to/img.svg'
  };
  const wrapper = mount(<Tile {...props} />);
  expect(wrapper.contains(<Scannable {...props} />)).toEqual(true);
});

it('renders with a folder className', () => {
  const folderClassName = 'Tile--folder';
  const props = {
    loadBoard: 'boardId',
    variant: 'folder'
  };
  const wrapper = mount(<Tile {...props} />);
  expect(wrapper.hasClass(folderClassName)).toEqual(true);
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
  wrapper.simulate('focus');
  expect(props.onFocus.mock.calls[0][0]).toEqual(props.id);
});

it('on tile click', () => {
  const props = {
    variant: 'button',
    onClick: jest.fn()
  };
  const wrapper = shallow(<Tile {...props} />);
  wrapper.simulate('click');
  expect(props.onClick.mock.calls.length).toEqual(1);
  expect(props.onClick.mock.calls[0][0].id).toEqual(props.id);
});
