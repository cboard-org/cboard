import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';

import Symbol from '../../Symbol';
import BoardButton from './BoardButton';

it('renders without crashing', () => {
  shallow(<BoardButton />);
});

it('renders with <Symbol />', () => {
  const wrapper = shallow(<BoardButton />);
  expect(wrapper.contains(<Symbol />));
});

it('renders with correct label', () => {
  const props = {
    label: 'dummy label'
  };
  const wrapper = shallow(<BoardButton {...props} />);
  expect(wrapper.find(Symbol).prop('label')).toEqual(
    <FormattedMessage id={props.label} />
  );
});

it('renders with correct image', () => {
  const props = {
    img: 'path/to/img.svg'
  };
  const wrapper = shallow(<BoardButton {...props} />);
  expect(wrapper.find(Symbol).prop('src')).toEqual(props.image);
});

it('renders with a folder className', () => {
  const folderClassName = 'BoardButton--folder';
  const props = {
    type: 'folder'
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
