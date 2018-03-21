import React from 'react';
import { shallow, mount } from 'enzyme';

import Symbol from '../../UI/Symbol';
import BoardButton from './BoardButton.component';

it('renders without crashing', () => {
  shallow(<BoardButton />);
});

it('renders with <Symbol /> child', () => {
  const wrapper = shallow(<BoardButton />);
  expect(wrapper.contains(<Symbol />)).toEqual(true);
});

it('renders with <Symbol /> child and props', () => {
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

it('update focus on props change', () => {
  const props = {
    hasFocus: false
  };
  const wrapper = mount(<BoardButton {...props} />);
  const instance = wrapper.instance();
  instance.updateFocus = jest.fn();
  wrapper.setProps({ hasFocus: true });
  expect(instance.updateFocus.mock.calls.length).toEqual(1);
});

it('set ref element', () => {
  const wrapper = mount(<BoardButton />);
  const instance = wrapper.instance();
  expect(instance.buttonElement).toBeTruthy();
});

it('focus ref element', () => {
  const props = {
    hasFocus: true
  };
  const wrapper = mount(<BoardButton {...props} />);
  const instance = wrapper.instance();
  const focus = jest.fn();
  instance.buttonElement = { focus };
  instance.updateFocus();
  expect(focus.mock.calls.length).toEqual(1);
});

it('on button focus', () => {
  const props = {
    id: '42',
    onFocus: jest.fn()
  };
  const wrapper = shallow(<BoardButton {...props} />);
  wrapper.simulate('focus');
  expect(props.onFocus.mock.calls[0][0]).toEqual(props.id);
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
