import React from 'react';
import { shallow, mount } from 'enzyme';

import NavBar from './NavBar';
import { shallowMatchSnapshot } from '../../../common/test_utils';

const COMPONENT_PROPS = {
  className: 'string',
  title: 'string',
  disabled: false,
  isLocked: false,
  onBackClick: () => { },
  onLockClick: () => { },
  isScannerActive: false,
  onDeactivateScannerClick: () => { }
};

describe('NavBar tests', () => {
  global.navigator = Object.create(navigator);
  Object.defineProperty(navigator, 'share', {
    value: () => { }
  });
  it('renders without crashing', () => {
    shallow(<NavBar />);
  });
  test('default renderer', () => {
    shallowMatchSnapshot(<NavBar {...COMPONENT_PROPS} />);
  });
});


