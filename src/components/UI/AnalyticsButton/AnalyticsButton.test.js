import React from 'react';

import { matchSnapshotWithIntlProvider } from '../../../common/test_utils';
import AnalyticsButton from './AnalyticsButton';

describe('AnalyticsButton tests', () => {
  const props = {
    disabled: false,
    onClick: () => {}
  };

  test('default renderer', () => {
    matchSnapshotWithIntlProvider(<AnalyticsButton {...props} />);
  });
});
