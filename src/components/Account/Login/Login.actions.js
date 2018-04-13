import axios from 'axios';

import { API_URL } from '../../../constants';
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_ERROR } from './Login.constants';

function loginRequest() {
  return {
    type: LOGIN_REQUEST
  };
}

function loginSuccess(payload) {
  return {
    type: LOGIN_SUCCESS,
    payload
  };
}

function loginError(payload) {
  return {
    type: LOGIN_ERROR,
    payload
  };
}

export function login({ email, password }, role = 'admin') {
  return async dispatch => {
    dispatch(loginRequest());

    try {
      const { data } = await axios.post(`${API_URL}/user/login/${role}`, {
        email,
        password
      });

      console.log(data);
      dispatch(loginSuccess(data));
    } catch (e) {
      console.log(e);
      dispatch(loginError(e.response.data));
    }
  };
}
