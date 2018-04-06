import axios from 'axios';

import { API_URL } from '../../../constants';
import {
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_ERROR
} from './SignUp.constants';

function signUpRequest() {
  return {
    type: SIGNUP_REQUEST
  };
}

function signUpSuccess(payload) {
  return {
    type: SIGNUP_SUCCESS,
    payload
  };
}

function signUpError(payload) {
  return {
    type: SIGNUP_ERROR,
    payload
  };
}

export function signUp(formValues) {
  return async dispatch => {
    dispatch(signUpRequest());

    try {
      const response = await axios.post(`${API_URL}/user`, formValues);
      console.log(response);

      dispatch(signUpSuccess(response.data));
    } catch (e) {
      console.log(e.response.data);
      dispatch(signUpError(e.response.data));
    }
  };
}
