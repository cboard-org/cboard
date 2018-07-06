import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';

import ColorSelect from './ColorSelect';

describe('ColorSelect tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<ColorSelect />);
  });
});
