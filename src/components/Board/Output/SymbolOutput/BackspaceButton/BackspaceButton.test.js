import React from 'react';
import { shallowMatchSnapshot } from '../../../../../common/test_utils';

import BackspaceButton from './BackspaceButton';

describe('BackspaceButton tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<BackspaceButton />);
  });
});
