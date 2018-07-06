import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';

import IconButton from './IconButton';

describe('IconButton tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(
      <IconButton label="Go back">
        <div>icon</div>
      </IconButton>
    );
  });
});
