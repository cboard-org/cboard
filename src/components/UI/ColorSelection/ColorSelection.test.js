import React from 'react';
import { matchSnapshotWithIntlProvider } from '../../../common/test_utils';

import ColorSelection from './ColorSelection.component';

describe('ColorSelection tests', () => {
  test('default renderer', () => {
    matchSnapshotWithIntlProvider(<ColorSelection />);
  });
});
