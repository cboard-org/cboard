import axios from 'axios';
import get from 'lodash/fp/get';

import { API_URL } from '../../../constants';

export function signUp(formValues) {
  return axios
    .post(`${API_URL}/user`, formValues)
    .then(get('data'))
    .catch(get('response.data'));
}
