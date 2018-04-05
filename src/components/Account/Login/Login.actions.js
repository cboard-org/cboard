import axios from 'axios';

import { API_URL } from '../../../constants';
import { LOGIN_ERROR, LOGIN_REQUEST, LOGIN_SUCCESS } from './Login.constants';

function loginError(payload) {
  return {
    type: LOGIN_ERROR,
    payload
  };
}

function loginRequest() {
  return {
    type: LOGIN_REQUEST
  };
}

function loginSuccess() {
  return {
    type: LOGIN_SUCCESS
  };
}

export function login({ email, password }, role = 'admin') {
  return async dispatch => {
    dispatch(loginRequest());

    try {
      const response = await axios.post(`${API_URL}/user/login/${role}`, {
        email,
        password
      });

      console.log(response);
      dispatch(loginSuccess());
    } catch (e) {
      console.log(e);
      dispatch(loginError({}));
    }
  };
}
