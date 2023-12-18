import { defineMessages } from 'react-intl';

export default defineMessages({
  featureBlockedTitle: {
    id: 'cboard.components.LoginRequiredModal.featureBlockedTitle',
    defaultMessage: 'This feature is blocked'
  },
  featureBlockedText: {
    id: 'cboard.components.LoginRequiredModal.featureBlockedText',
    // Refer to un-logged in users as "anonymous users".
    // https://english.stackexchange.com/questions/251800/a-word-for-a-non-logged-in-user
    defaultMessage:
      'This feature is disabled for anonymous users. To continue using it please sign up or login'
  },
  loginSignupNow: {
    id: 'cboard.components.PremiumFeature.loginSignupNow',
    defaultMessage: 'Login or Sign Up now'
  }
});
