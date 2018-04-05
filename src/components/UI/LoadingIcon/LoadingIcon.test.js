import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import LoadingIcon from './LoadingIcon';

describe('LoadingIcon tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<LoadingIcon />);
  });
});
