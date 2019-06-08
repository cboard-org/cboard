import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';

import EmptyBoard from './EmptyBoard.component';

describe('EmptyBoard tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<EmptyBoard />);
  });
});
