import React from 'react';
import { shallow } from 'enzyme';

import Symbol from '../../Symbol';
import BoardButton from './BoardButton';

it('renders without crashing', () => {
  shallow(<BoardButton />);
});

it('renders with child <Symbol />', () => {
  const wrapper = shallow(<BoardButton />);
  expect(wrapper.contains(<Symbol />)).toEqual(true);
});

it('renders with child <Symbol /> and correct props', () => {
  const props = {
    label: 'dummy label',
    img: 'path/to/img.svg'
  };
  const wrapper = shallow(<BoardButton {...props} />);
  expect(wrapper.contains(<Symbol {...props} />)).toEqual(true);
});

it('renders with a folder className', () => {
  const folderClassName = 'BoardButton--folder';
  const props = {
    loadBoard: 'boardId'
  };
  const wrapper = shallow(<BoardButton {...props} />);
  expect(wrapper.hasClass(folderClassName)).toEqual(true);
});

it('on button click', () => {
  const props = {
    id: '42',
    onClick: jest.fn()
  };
  const wrapper = shallow(<BoardButton {...props} />);
  wrapper.simulate('click');
  expect(props.onClick.mock.calls.length).toEqual(1);
  expect(props.onClick.mock.calls[0][0].id).toEqual(props.id);
});
