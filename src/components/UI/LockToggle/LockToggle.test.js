import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';

import LockToggle from './LockToggle';

describe('LockToggle tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<LockToggle onClick={() => {}} />);
  });
});
