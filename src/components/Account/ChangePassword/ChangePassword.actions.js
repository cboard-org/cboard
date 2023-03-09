import API from '../../../api';
import {
  STORE_PASSWORD_API_FAILURE,
  STORE_PASSWORD_API_STARTED,
  STORE_PASSWORD_API_SUCCESS
} from './ChangePassword.constants';

export function storePasswordApiStarted() {
  return {
    type: STORE_PASSWORD_API_STARTED
  };
}

export function storePasswordApiFailure(message) {
  return {
    type: STORE_PASSWORD_API_FAILURE,
    message
  };
}

export function storePasswordApiSuccess(board) {
  return {
    type: STORE_PASSWORD_API_SUCCESS,
    board
  };
}

export function storePassword(userid, password, url) {
  return async dispatch => {
    try {
      dispatch(storePasswordApiStarted());
      const res = await API.storePassword(userid, password, url);
      dispatch(storePasswordApiSuccess(res));
      return Promise.resolve(res);
    } catch (err) {
      dispatch(storePasswordApiFailure(err.message));
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
