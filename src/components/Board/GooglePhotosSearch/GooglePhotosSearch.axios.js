import axios from 'axios';
import get from 'lodash/fp/get';

//GET https://photoslibrary.googleapis.com/v1/albums/{albumId}
export function getAlbums(token) {
  const urlQuery = 'https://photoslibrary.googleapis.com/v1/albums';
  return axios
    .get(urlQuery, {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      return response.data;
    })
    .catch(get('response.data'));
}

export function getAlbumContent(token, id) {
  const urlQuery =
    'https://content-photoslibrary.googleapis.com/v1/mediaItems:search';
  return axios
    .post(
      urlQuery,
      {
        albumId: id
      },
      {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then(response => {
      return response.data.mediaItems;
    })
    .catch(get('response.data'));
}
