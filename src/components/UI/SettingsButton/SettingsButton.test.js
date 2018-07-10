import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';

import SettingsButton from './SettingsButton';

describe('SettingsButton tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<SettingsButton onClick={() => {}} />);
  });
});
