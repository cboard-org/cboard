import axios from 'axios';
import get from 'lodash/fp/get';

import { API_URL } from '../../../constants';

import {
  SIGN_UP_API_FAILURE,
  SIGN_UP_API_STARTED,
  SIGN_UP_API_SUCCESS
} from './SignUp.constants';

export function signUpApiStarted() {
  return {
    type: SIGN_UP_API_STARTED
  };
}

export function signUpApiFailure(message) {
  return {
    type: SIGN_UP_API_FAILURE,
    message
  };
}

export function signUpApiSuccess() {
  return {
    type: SIGN_UP_API_SUCCESS
  };
}

export function signUp(formValues) {
  const endpoint =
    API_URL[API_URL.length - 1] === '/' ? `${API_URL}user` : `${API_URL}/user`;
  return axios
    .post(endpoint, formValues)
    .then(get('data'))
    .catch(get('response.data'));
}
