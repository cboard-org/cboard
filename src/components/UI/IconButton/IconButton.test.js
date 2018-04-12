import React from 'react';
import { matchSnapshotWithIntlProvider } from '../../../common/test_utils';

import IconButton from './IconButton.component';

describe('IconButton tests', () => {
  test('default renderer', () => {
    matchSnapshotWithIntlProvider(
      <IconButton label="Go back">
        <div>icon</div>
      </IconButton>
    );
  });
});
