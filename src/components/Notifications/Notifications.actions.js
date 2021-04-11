import {
  SHOW_NOTIFICATION,
  HIDE_NOTIFICATION
} from './Notifications.constants';

export function showNotification(message, kind) {
  return {
    type: SHOW_NOTIFICATION,
    message,
    open: true,
    kind: kind
  };
}

export function hideNotification() {
  return {
    type: HIDE_NOTIFICATION,
    open: false
  };
}
