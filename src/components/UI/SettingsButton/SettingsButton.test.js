import React from 'react';

import { matchSnapshotWithIntlProvider } from '../../../common/test_utils';
import SettingsButton from './SettingsButton';

describe('SettingsButton tests', () => {
  const props = {
    disabled: false,
    onClick: () => {}
  };

  test('default renderer', () => {
    matchSnapshotWithIntlProvider(<SettingsButton {...props} />);
  });
});
