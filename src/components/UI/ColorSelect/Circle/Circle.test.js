import React from 'react';
import { shallowMatchSnapshot } from '../../../../common/test_utils';

import Circle from './Circle';

describe('Circle tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<Circle />);
  });
});
