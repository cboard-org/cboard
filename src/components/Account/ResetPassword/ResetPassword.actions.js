import API from '../../../api';
import { RESET_PASSWORD } from './ResetPassword.constants';
import { addBoards } from '../../Board/Board.actions';

export function forgot({ email }, type = 'local') {
  return async (dispatch, getState) => {
    try {
      const loginData = await API.forgot(email);
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
