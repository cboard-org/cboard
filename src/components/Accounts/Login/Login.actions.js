import axios from 'axios';

import { API_URL } from '../../../constants';
import { LOGIN_ERROR, LOGIN_REQUEST, LOGIN_SUCCESS } from './Login.constants';

function loginError() {
  return {
    type: LOGIN_ERROR
  };
}

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

export function login(formValues, role = 'user') {
  return async dispatch => {
    dispatch(loginRequest());

    try {
      const response = await axios.post(
        `${API_URL}/user/login/${role}`,
        formValues
      );

      console.log(response);
      dispatch(loginSuccess());
    } catch (e) {
      console.log(e.response);
      dispatch(loginError());
    }
  };
}
