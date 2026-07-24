import React from 'react';
import { mount } from 'enzyme';
import SignUp from './SignUp.component';

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
    },
    next: {
      id: 'cboard.components.SignUp.next',
      defaultMessage: 'Next'
    },
    back: {
      id: 'cboard.components.SignUp.back',
      defaultMessage: 'Back'
    },
    completeSignUp: {
      id: 'cboard.components.SignUp.completeSignUp',
      defaultMessage: 'Complete Sign Up'
    },
    role: { id: 'cboard.components.SignUp.role' },
    roleAACUser: { id: 'cboard.components.SignUp.roleAACUser' },
    roleEducator: { id: 'cboard.components.SignUp.roleEducator' },
    roleTherapist: { id: 'cboard.components.SignUp.roleTherapist' },
    roleFamily: { id: 'cboard.components.SignUp.roleFamily' },
    age: { id: 'cboard.components.SignUp.age' },
    pathology: { id: 'cboard.components.SignUp.pathology' },
    pathologyAutism: { id: 'cboard.components.SignUp.pathologyAutism' },
    pathologyCerebralPalsy: {
      id: 'cboard.components.SignUp.pathologyCerebralPalsy'
    },
    pathologyALS: { id: 'cboard.components.SignUp.pathologyALS' },
    pathologyAphasia: { id: 'cboard.components.SignUp.pathologyAphasia' },
    pathologyDownSyndrome: {
      id: 'cboard.components.SignUp.pathologyDownSyndrome'
    },
    pathologyOther: { id: 'cboard.components.SignUp.pathologyOther' },
    pathologyPreferNotToSay: {
      id: 'cboard.components.SignUp.pathologyPreferNotToSay'
    },
    agreement: {
      id: 'cboard.components.SignUp.agreement',
      defaultMessage: 'agreement'
    },
    termsAndConditions: {
      id: 'cboard.components.SignUp.termsAndConditions',
      defaultMessage: 'terms'
    },
    privacy: {
      id: 'cboard.components.SignUp.privacy',
      defaultMessage: 'privacy'
    }
  };
});

describe('SignUp tests', () => {
  const props = {
    isDialogOpen: false,
    onClose: jest.fn()
  };

  test('default renderer', () => {
    const wrapper = mount(<SignUp {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  test('check with submit', () => {
    const wrapper = mount(<SignUp {...props} />);
    const form = wrapper.find('Formik').at(0);
    try {
      form.simulate('submit', { passwordConfirm: {} }, { email: 'test' });
    } catch (e) {}
  });
});
