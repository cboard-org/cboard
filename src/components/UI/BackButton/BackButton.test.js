import React from 'react';
import { matchSnapshotWithIntlProvider } from '../../../common/test_utils';

import BackButton from './BackButton.component';

describe('BackButton tests', () => {
  test('default renderer', () => {
    matchSnapshotWithIntlProvider(<BackButton onClick={() => {}} />);
  });
});
