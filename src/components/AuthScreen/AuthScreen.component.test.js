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
    shallowMatchSnapshot(<AuthScreen history={{ goBack: () => { } }} />);
  });
  test('check FacebookLoginButton', () => {
    const wrapper = shallow(<AuthScreen history={{ goBack: () => { } }} />);
    wrapper.find('.AuthScreen__button.AuthScreen__button--facebook').simulate('click');
    expect(window.location).toMatch('login/facebook');
  });
  test('check googleLoginButton', () => {
    const wrapper = shallow(<AuthScreen history={{ goBack: () => { } }} />);
    wrapper.find('.AuthScreen__button.AuthScreen__button--google').simulate('click');
    expect(window.location).toMatch('login/google');
  });
  test('check signup Button', () => {
    const wrapper = shallow(<AuthScreen history={{ goBack: () => { } }} />);
    wrapper.find('.AuthScreen__button.AuthScreen__button--signup').simulate('click');
    expect(wrapper.state().activeView).toEqual('signup');
  });
  test('check login Button', () => {
    const wrapper = shallow(<AuthScreen history={{ goBack: () => { } }} />);
    wrapper.find('.AuthScreen__button.AuthScreen__button--login').simulate('click');
    expect(wrapper.state().activeView).toEqual('login');
  });
  test('check signup close ', () => {
    const wrapper = shallow(<AuthScreen history={{ goBack: () => { } }} />);
    wrapper.find('.AuthScreen__button.AuthScreen__button--signup').simulate('click');
    wrapper.find('SignUp').simulate('close');
    expect(wrapper.state().activeView).toEqual('');
  });
});
