import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import LockButton from './LockButton';

describe('LockButton tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<LockButton />);
  });
});
