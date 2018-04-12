import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';

import LockButton from './LockButton.component';

describe('LockButton tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<LockButton onClick={() => {}} onNotify={() => {}} />);
  });
});
