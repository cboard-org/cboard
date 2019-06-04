import React from 'react';
import { shallow, mount } from 'enzyme';
import { Scannable } from 'react-scannable';

import Symbol from '../Symbol';
import Tile from './Tile.component';

it('renders without crashing', () => {
  shallow(<Tile />);
});

it('renders with <Scannable /> child', () => {
  const wrapper = shallow(<Tile />);
  expect(wrapper.find('Scannable')).toHaveLength(1);
});

it('renders with <Scannable /> child and props', () => {
  const props = {
    label: 'dummy label',
    img: 'path/to/img.svg'
  };
  const wrapper = shallow(<Tile {...props} />);
  expect(wrapper.contains(<Scannable {...props} />)).to.equal(true);
});

it('renders with a folder className', () => {
  const folderClassName = 'Tile--folder';
  const props = {
    loadBoard: 'boardId'
  };
  const wrapper = shallow(<Tile {...props} />);
  expect(wrapper.hasClass(folderClassName)).to.equal(true);
});

it('set ref element', () => {
  const wrapper = mount(<Tile />);
  const instance = wrapper.instance();
  expect(instance.tileElement).toBeTruthy();
});

it('on tile focus', () => {
  const props = {
    id: '42',
    onFocus: jest.fn()
  };
  const wrapper = shallow(<Tile {...props} />);
  wrapper.simulate('focus');
  expect(props.onFocus.mock.calls[0][0]).to.equal(props.id);
});

it('on tile click', () => {
  const props = {
    id: '42',
    onClick: jest.fn()
  };
  const wrapper = shallow(<Tile {...props} />);
  wrapper.simulate('click');
  expect(props.onClick.mock.calls.length).to.equal(1);
  expect(props.onClick.mock.calls[0][0].id).to.equal(props.id);
});
