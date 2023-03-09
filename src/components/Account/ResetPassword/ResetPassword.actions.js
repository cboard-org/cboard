import API from '../../../api';
import {
  FORGOT_API_FAILURE,
  FORGOT_API_STARTED,
  FORGOT_API_SUCCESS
} from './ResetPassword.constants';

export function forgotApiStarted() {
  return {
    type: FORGOT_API_STARTED
  };
}

export function forgotApiFailure(message) {
  return {
    type: FORGOT_API_FAILURE,
    message
  };
}

export function forgotApiSuccess(board) {
  return {
    type: FORGOT_API_SUCCESS,
    board
  };
}

export function forgot({ email }, type = 'local') {
  return async dispatch => {
    try {
      dispatch(forgotApiStarted());
      const res = await API.forgot(email);
      dispatch(forgotApiSuccess(res));
      return Promise.resolve(res);
    } catch (err) {
      dispatch(forgotApiFailure(err.message));
      if (err.response != null) {
        return Promise.reject(err.response.data);
      }
      var disonnected = {
        message: 'Unable to contact server. Try in a moment'
      };
      return Promise.reject(disonnected);
    }
  };
}
