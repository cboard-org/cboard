import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import TextField from './TextField';

describe('TextField tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<TextField error={'myerror'} />);
  });
});
