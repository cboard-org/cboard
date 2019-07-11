import React from 'react';

import { shallowMatchSnapshot } from '../../../../common/test_utils';
import Information from '../Information';

jest.mock('../Information.messages', () => ({
  heading: {
    id: 'cboard.components.AuthScreenInformation.heading',
    defaultMessage: 'Cboard'
  },
  text: {
    id: 'cboard.components.AuthScreenInformation.text',
    defaultMessage: 'Sign up to sync your settings!'
  }
}));

describe('AuthScreen Information tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<Information />);
  });
});
