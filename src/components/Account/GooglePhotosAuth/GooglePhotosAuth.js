import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import API from '../../../api';

export default function GooglePhotosAuth() {
  const { search } = useLocation();
  console.log('search', search);

  useEffect(
    () => {
      async function fetchData() {
        console.log('fetching');
        const data = await API['authGooglePhotos'](search);
        console.log('data', data);
      }
      fetchData();
    },
    [search]
  );

  return <h1>loading</h1>;
}
