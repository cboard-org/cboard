import { SHOW_NOTIFICATION, HIDE_NOTIFICATION } from './constants';

function notificationsReducer(state = { message: '', open: false }, action) {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return {
        message: action.message,
        open: action.open
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
