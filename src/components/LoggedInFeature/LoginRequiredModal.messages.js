import { defineMessages } from 'react-intl';

export default defineMessages({
  featureBlockedTitle: {
    id: 'cboard.components.LoginRequiredModal.featureBlockedTitle',
    defaultMessage: 'Login or Sign Up to use this feature'
  },
  featureBlockedText: {
    id: 'cboard.components.LoginRequiredModal.featureBlockedText',
    // Refer to un-logged in users as "anonymous users".
    // https://english.stackexchange.com/questions/251800/a-word-for-a-non-logged-in-user
    defaultMessage:
      'This feature is disabled for anonymous users. To continue using it please sign up or login'
  },
  loginSignupNow: {
    id: 'cboard.components.LoginRequiredModal.loginSignupNow',
    defaultMessage: 'Login or Sign Up now'
  },
  continueWithoutSaving: {
    id: 'cboard.components.LoginRequiredModal.continueWithoutSaving',
    defaultMessage: 'Continue without saving'
  },
  unauthenticatedEditTitle: {
    id: 'cboard.components.LoginRequiredModal.unauthenticatedEditTitle',
    defaultMessage: 'You are not logged in'
  },
  unauthenticatedEditText: {
    id: 'cboard.components.LoginRequiredModal.unauthenticatedEditText',
    defaultMessage:
      'Any changes you make will not be saved. If you already have a Cboard account, log in to save your changes. If you do not have an account yet, sign up to keep your work.'
  }
});
