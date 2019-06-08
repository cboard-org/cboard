import React from 'react';
import { shallowMatchSnapshot } from '../../../../../common/test_utils';

import ClearButton from './ClearButton';

describe('ClearButton tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<ClearButton />);
  });
});
