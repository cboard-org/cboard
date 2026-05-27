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
      'Your changes are saved locally on this device. If you sign up for a new account, your changes will be synced and kept. If you already have a Cboard account with boards, logging in will replace your local changes with your saved boards.'
  }
});
