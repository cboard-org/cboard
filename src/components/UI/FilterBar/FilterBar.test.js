import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';

import FilterBar from './FilterBar';

describe('FilterBar tests', () => {
  test('default renderer', () => {
    const props = {
      onChange: () => {},
      options: []
    };
    shallowMatchSnapshot(<FilterBar {...props} />);
  });
});
