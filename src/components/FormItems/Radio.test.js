import React from 'react';
import { shallowMatchSnapshot } from '../../common/test_utils';
import Radio from './Radio.component';

describe('Radio tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<Radio />);
  });
});
