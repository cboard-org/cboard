import React from 'react';
import { shallow, mount } from 'enzyme';

import NavBar from './NavBar';
import { shallowMatchSnapshot } from '../../../common/test_utils';

const mockBoard = {
  name: 'tewt',
  id: '12345678901234567',
  tiles: [{ id: '1234', loadBoard: '456456456456456456456' }],
  isPublic: false,
  email: 'asd@qwe.com',
  markToUpdate: true
};

describe('NavBar tests', () => {
  const COMPONENT_PROPS = {
    intl: {},
    board: mockBoard,
    userData: { email: 'qa@qa.com' },
    onLockNotify: jest.fn(),
    className: 'string',
    title: 'string',
    disabled: false,
    isLocked: false,
    onBackClick: jest.fn(),
    onLockClick: jest.fn(),
    isScannerActive: false,
    onDeactivateScannerClick: jest.fn()
  };

  it('renders without crashing', () => {
    const wrapper = shallow(<NavBar {...COMPONENT_PROPS} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders without crashing locked', () => {
    const props = {
      ...COMPONENT_PROPS,
      isLocked: true
    };
    const wrapper = shallow(<NavBar {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
  test('check share', () => {
    const wrapper = shallow(<NavBar {...COMPONENT_PROPS} />);
    wrapper.prop('onLockClick')();
  });
});
