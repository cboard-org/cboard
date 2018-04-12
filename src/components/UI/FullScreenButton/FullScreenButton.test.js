import React from 'react';
import { matchSnapshotWithIntlProvider } from '../../../common/test_utils';

import FullScreenButton from './FullScreenButton.component';

describe('FullScreenButton tests', () => {
  test('default renderer', () => {
    matchSnapshotWithIntlProvider(<FullScreenButton />);
  });
});
