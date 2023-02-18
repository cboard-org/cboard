import React from 'react';
import { shallow } from 'enzyme';
import { Login } from './Login.component';

jest.mock('./Login.messages', () => {
  return {
    login: {
      id: 'cboard.components.Login.login',
      defaultMessage: 'Login'
    },
    email: {
      id: 'cboard.components.Login.email',
      defaultMessage: 'Email'
    },
    password: {
      id: 'cboard.components.Login.password',
      defaultMessage: 'Password'
    },
    cancel: {
      id: 'cboard.components.Login.cancel',
      defaultMessage: 'Cancel'
    }
  };
});

const props = {
  isDialogOpen: false,
  onClose: jest.fn(),
  intl: {
    formatMessage: msg => msg
  },
  onResetPasswordClick: jest.fn()
};

describe('Login tests', () => {
  test('default renderer', () => {
    const wrapper = shallow(<Login {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
