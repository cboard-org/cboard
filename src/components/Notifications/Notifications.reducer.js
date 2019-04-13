import {
  SHOW_NOTIFICATION,
  HIDE_NOTIFICATION
} from './Notifications.constants';

const initialState = { message: '', open: false, action: [] };

function notificationsReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return {
        message: action.message,
        open: action.open,
        action: action.action
      };
    case HIDE_NOTIFICATION:
      return {
        message: '',
        open: action.open,
        action: action.action
      };
    default:
      return state;
  }
}

export default notificationsReducer;
