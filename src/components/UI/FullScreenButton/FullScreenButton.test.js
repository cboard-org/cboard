import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import FullScreenButton from './FullScreenButton';

describe('FullScreenButton tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<FullScreenButton />);
  });
});
