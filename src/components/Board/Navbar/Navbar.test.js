import React from 'react';
import { shallow, mount } from 'enzyme';

import Navbar from './Navbar';

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
    const wrapper = shallow(<Navbar {...COMPONENT_PROPS} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders without crashing locked', () => {
    const props = {
      ...COMPONENT_PROPS,
      isLocked: true
    };
    const wrapper = shallow(<Navbar {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
