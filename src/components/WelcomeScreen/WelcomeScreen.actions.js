import axios from 'axios';
import get from 'lodash/fp/get';

import { API_URL } from '../../constants';

export function sendAndroidAuthData(obj) {
  const endpoint =
    API_URL[API_URL.length - 1] === '/'
      ? `${API_URL}login/googletoken`
      : `${API_URL}/login/googletoken`;
  return axios
    .get(endpoint, { params: { access_token: obj.accessToken } })
    .then(res => alert(JSON.stringify(res.data)))
    .catch(get('response.data'));
}

export function sendAndroidAuthDataVerifyAccesToken(obj) {
  return axios
    .get('https://oauth2.googleapis.com/tokeninfo', {
      params: { access_token: obj.accessToken }
    })
    .then(function(response) {
      // handle success
      alert(JSON.stringify(response.data));
    })
    .catch(function(error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        alert(JSON.stringify(error.response.data));
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
    });
}
