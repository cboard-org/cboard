import React from 'react';
import { shallowMatchSnapshot } from '../../common/test_utils';
import ColorSelection from './ColorSelection.component';

describe('ColorSelection tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<ColorSelection />);
  });
});
