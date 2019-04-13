import {
  SHOW_NOTIFICATION,
  HIDE_NOTIFICATION
} from './Notifications.constants';

export function showNotification(message, action = []) {
  return {
    type: SHOW_NOTIFICATION,
    message,
    action,
    open: true
  };
}

export function hideNotification() {
  return {
    type: HIDE_NOTIFICATION,
    open: false
  };
}
