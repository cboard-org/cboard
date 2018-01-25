import axios from 'axios';
import { API_URL } from '../../../constants';
import {
  SIGNUP_ERROR,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS
} from './SignUp.constants';
// import { showNotification } from '../../Notifications/Notifications.actions';

function signUpError() {
  return {
    type: SIGNUP_ERROR
  };
}

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

export function signUp(formValues) {
  return async dispatch => {
    dispatch(signUpRequest());

    try {
      const response = await axios.post(`${API_URL}/user`, formValues);
      console.log(response);

      // dispatch(showNotification(response.data.message));
      dispatch(signUpSuccess());
    } catch (e) {
      console.log(e.response);
      // dispatch(showNotification(e.response.data.message));
      dispatch(signUpError());
    }
  };
}
