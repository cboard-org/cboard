import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'cboard.components.UnauthenticatedEditModal.title',
    defaultMessage: 'You are not logged in'
  },
  text: {
    id: 'cboard.components.UnauthenticatedEditModal.text',
    defaultMessage:
      'Your changes will be saved locally on this device only. Sign up to keep your boards synced across devices.'
  },
  continueEditing: {
    id: 'cboard.components.UnauthenticatedEditModal.continueEditing',
    defaultMessage: 'Continue editing'
  },
  loginSignup: {
    id: 'cboard.components.UnauthenticatedEditModal.loginSignup',
    defaultMessage: 'Login or Sign Up'
  }
});
