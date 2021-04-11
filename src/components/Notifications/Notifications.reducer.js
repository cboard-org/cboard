import {
  SHOW_NOTIFICATION,
  HIDE_NOTIFICATION
} from './Notifications.constants';

const initialState = { message: '', open: false , kind : undefined };

function notificationsReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return {
        message: action.message,
        open: action.open,
        kind: action.kind
      };
    case HIDE_NOTIFICATION:
      return {
        message: '',
        open: action.open
      };
    default:
      return state;
  }
}

export default notificationsReducer;
