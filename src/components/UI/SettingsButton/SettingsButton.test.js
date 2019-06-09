import React from 'react';

import { shallowMatchSnapshot } from '../../../common/test_utils';
import SettingsButton from './SettingsButton';

const intlMock = {
  formatMessage: () => 'dummy message'
};

describe('SettingsButton tests', () => {
  const props = {
    intl: intlMock,
    onClick: () => {}
  };

  test('default renderer', () => {
    shallowMatchSnapshot(<SettingsButton {...props} />);
  });
});
