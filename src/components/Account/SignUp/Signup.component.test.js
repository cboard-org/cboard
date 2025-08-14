import React from 'react';
import { shallow, mount } from 'enzyme';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import { SignUp } from './SignUp.component';
import { createIntl, createIntlCache } from 'react-intl';

const cache = createIntlCache();
const intl = createIntl({ locale: 'en', messages: {} }, cache);

it('handles submit failure', async () => {
  const wrapper = shallow(
    <SignUp
      intl={intl}
      isDialogOpen
      onClose={jest.fn()}
      dialogWithKeyboardStyle={{}}
    />
  );
});

jest.mock('./SignUp.messages', () => {
  return {
    signUp: {
      id: 'cboard.components.SignUp.signUp',
      defaultMessage: 'Sign Up'
    },
    name: {
      id: 'cboard.components.SignUp.name',
      defaultMessage: 'Name'
    },
    email: {
      id: 'cboard.components.SignUp.email',
      defaultMessage: 'Email'
    },
    createYourPassword: {
      id: 'cboard.components.SignUp.createYourPassword',
      defaultMessage: 'Create your password'
    },
    confirmYourPassword: {
      id: 'cboard.components.SignUp.confirmYourPassword',
      defaultMessage: 'Confirm your password'
    },
    cancel: {
      id: 'cboard.components.SignUp.cancel',
      defaultMessage: 'Cancel'
    },
    signMeUp: {
      id: 'cboard.components.SignUp.signMeUp',
      defaultMessage: 'Sign me up'
    }
  };
});

describe('SignUp tests', () => {
  const props = {
    isDialogOpen: false,
    onClose: jest.fn()
  };
  test('default renderer', () => {
    const wrapper = shallow(<SignUp {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
  test('check with subnit', () => {
    const wrapper = shallow(<SignUp {...props} />);
    const form = wrapper.find('Formik').at(0);
    try {
      form.simulate('submit', { passwordConfirm: {} }, { email: 'test' });
    } catch (e) {}
  });
});
