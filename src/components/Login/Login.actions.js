import axios from 'axios';
import { API_URL } from '../../constants';
import { LOGIN_ERROR, LOGIN_REQUEST, LOGIN_SUCCESS } from './Login.constants';
// import { showNotification } from '../../Notifications/Notifications.actions';

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
      // dispatch(showNotification(response.data.message));
      dispatch(loginSuccess());
    } catch (e) {
      console.log(e.response);
      // dispatch(showNotification(e.response.data.message));
      dispatch(loginError());
    }
  };
}
