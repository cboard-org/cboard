import React from 'react';
import { shallow } from 'enzyme';

import { WelcomeScreen } from './WelcomeScreen.container';
jest.mock('./WelcomeScreen.messages', () => {
  return {
    login: {
      id: 'cboard.components.WelcomeScreen.login',
      defaultMessage: 'Login'
    },
    signUp: {
      id: 'cboard.components.WelcomeScreen.signUp',
      defaultMessage: 'Sign Up'
    },
    facebook: {
      id: 'cboard.components.WelcomeScreen.facebook',
      defaultMessage: 'Sign in with Facebook'
    },
    google: {
      id: 'cboard.components.WelcomeScreen.google',
      defaultMessage: 'Sign in with Google'
    },
    skipForNow: {
      id: 'cboard.components.WelcomeScreen.skipForNow',
      defaultMessage: 'Skip for now'
    }
  };
});
const intlMock = {
  formatMessage: ({ id }) => id
};
it('renders without crashing', () => {
  const props = {
    intlMock,
    finishFirstVisit: jest.fn()
  };
  shallow(<WelcomeScreen {...props} />);
});
