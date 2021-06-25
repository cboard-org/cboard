import axios from 'axios';

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
    .catch(err => {
      throw new Error(err.message);
    })
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
    .catch(err => {
      throw new Error(err.message);
    })
}
