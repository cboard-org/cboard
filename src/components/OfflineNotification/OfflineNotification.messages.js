import { defineMessages } from 'react-intl';

export default defineMessages({
  offlineTitle: {
    id: 'cboard.components.OfflineNotification.offlineTitle',
    defaultMessage: "You're Offline"
  },
  offlineMessage: {
    id: 'cboard.components.OfflineNotification.offlineMessage',
    defaultMessage:
      'Any changes you make while offline will be saved on this device only. They will sync to the cloud when you reconnect.'
  },
  gotIt: {
    id: 'cboard.components.OfflineNotification.gotIt',
    defaultMessage: 'Got it'
  }
});
