import React from 'react';
import { shallowMatchSnapshot } from '../../common/test_utils';
import Radio from './Radio';

describe('Radio tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<Radio />);
  });
});
