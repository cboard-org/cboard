import axios from 'axios';
import get from 'lodash/fp/get';

import { API_URL } from '../../../constants';

export function signUp(formValues) {
  const endpoint = `${API_URL}user`;
  return axios.post(endpoint, formValues).then(get('data'));
}
