import axios from 'axios';
import get from 'lodash/fp/get';

import { API_URL } from '../../../constants';

export function activate(url) {
  return axios
    .post(`${API_URL}/user/activate/${url}`)
    .then(response => {
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);

      return response.data;
    })
    .catch(get('response.data'));
}
