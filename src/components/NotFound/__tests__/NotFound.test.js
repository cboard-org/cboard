import React from 'react';

import { shallowMatchSnapshot } from '../../../common/test_utils';
import NotFound from '../NotFound';

describe('NotFound tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<NotFound />);
  });
});
