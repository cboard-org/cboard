import axios from 'axios';
import get from 'lodash/fp/get';

//GET https://photoslibrary.googleapis.com/v1/albums/{albumId}
export function getAlbums(token) {
  console.log(token);
  return axios
    .get('https://content-photoslibrary.googleapis.com/v1/albums', {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      console.log(response.data);
      return response.data;
    })
    .catch(get('response.data'));
}
