import React from 'react';
import { matchSnapshotWithIntlProvider } from '../../../common/test_utils';

import LockButton from './LockButton.component';

describe('LockButton tests', () => {
  test('default renderer', () => {
    matchSnapshotWithIntlProvider(
      <LockButton onClick={() => {}} onNotify={() => {}} />
    );
  });
});
