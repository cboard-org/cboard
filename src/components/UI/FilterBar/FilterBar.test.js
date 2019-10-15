import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';

import FilterBar from './FilterBar';

const intlMock = { formatMessage: () => 'dummy message' };

describe('FilterBar tests', () => {
  test('default renderer', () => {
    const props = {
      onChange: () => {},
      options: []
    };
    shallowMatchSnapshot(<FilterBar {...props} />);
  });
});
