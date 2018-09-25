import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import CboardLogo from './CboardLogo.component';

describe('CboardLogo tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<CboardLogo />);
  });
});
