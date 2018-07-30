import API from '../../../api';
import { LOGIN_SUCCESS, LOGOUT } from './Login.constants';

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

export function login({ email, password }, role = 'admin') {
  return async dispatch => {
    try {
      const data = await API.login(role, email, password);
      dispatch(loginSuccess(data));
    } catch (e) {
      return Promise.reject(e.response.data);
    }
  };
}
