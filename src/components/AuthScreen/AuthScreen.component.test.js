import React from 'react';
import { shallow, mount } from 'enzyme';
import { shallowMatchSnapshot } from '../../common/test_utils';
import AuthScreen from './AuthScreen.component';

jest.mock('./AuthScreen.messages', () => {
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

describe('AuthScreen tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<AuthScreen history={{ goBack: () => {} }} />);
  });
});
