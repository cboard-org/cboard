import API from '../../../api';
import { RESET_PASSWORD } from './ResetPassword.constants';
import { addBoards } from '../../Board/Board.actions';

export function loginSuccess(payload) {
  return {
    type: LOGIN_SUCCESS,
    payload
  };
}

export function logout() {
  return {
    type: LOGOUT
  };
}

export function forgot({ email }, type = 'local') {
  return async (dispatch, getState) => {
    try {
      const loginData = await API.forgot(email);


      dispatch(addBoards(apiBoards));
      dispatch(loginSuccess(loginData));
    } catch (e) {
      if (e.response != null) {
        return Promise.reject(e.response.data);
      }
      var disonnected = {
        message: 'Unable to contact server. Try in a moment'
      };
      return Promise.reject(disonnected);
    }
  };
}
