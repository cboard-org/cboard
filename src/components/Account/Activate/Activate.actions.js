import axios from 'axios';

import { API_URL } from '../../../constants';
import {
  ACTIVATE_REQUEST,
  ACTIVATE_SUCCESS,
  ACTIVATE_ERROR
} from './Activate.constants';

function activateRequest() {
  return {
    type: ACTIVATE_REQUEST
  };
}

function activateSuccess() {
  return {
    type: ACTIVATE_SUCCESS
  };
}

function activateError(payload) {
  return {
    type: ACTIVATE_ERROR,
    payload
  };
}

export function activate(url) {
  return async dispatch => {
    dispatch(activateRequest());

    try {
      const response = await axios.post(`${API_URL}/user/activate/${url}`);

      console.log(response);
      dispatch(activateSuccess(response));

      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
      // dispatch()
    } catch (e) {
      console.log(e.response);
      dispatch(activateError(e.response.data));
    }
  };
}
