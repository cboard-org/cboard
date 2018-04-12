import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';

import BackButton from './BackButton.component';

describe('BackButton tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<BackButton onClick={() => {}} />);
  });
});
