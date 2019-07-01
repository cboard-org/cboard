import React from 'react';
import { shallow, mount } from 'enzyme';

import NavBar from './NavBar';
import { shallowMatchSnapshot } from '../../../common/test_utils';

const COMPONENT_PROPS = {

  intl: {},
  board: {
    email: 'qa@qa.com',
    isPublic: true
  },
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

describe('NavBar tests', () => {
  global.navigator = Object.create(navigator);
  Object.defineProperty(navigator, 'share', {
    value: () => { }
  });
  it('renders without crashing unlocked', () => {
    const wrapper = shallow(<NavBar isLocked={false} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders without crashing locked', () => {
    const wrapper = shallow(<NavBar isLocked={true} />);
    expect(wrapper).toMatchSnapshot();
  });
  test('default renderer', () => {
    shallowMatchSnapshot(<NavBar {...COMPONENT_PROPS} />);
  });
  test('check share', () => {
    const wrapper = shallow(<NavBar {...COMPONENT_PROPS} />);
  });
});



