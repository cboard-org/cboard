import {
  SHOW_NOTIFICATION,
  HIDE_NOTIFICATION
} from './Notifications.constants';

export function showNotification(message, showUndo = false) {
  return {
    type: SHOW_NOTIFICATION,
    message,
    showUndo,
    open: true
  };
}

export function hideNotification() {
  return {
    type: HIDE_NOTIFICATION,
    open: false
  };
}
