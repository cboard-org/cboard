import {
  FINISH_FIRST_VISIT,
  UPDATE_DISPLAY_SETTINGS,
  UPDATE_NAVIGATION_SETTINGS,
  UPDATE_USER_DATA,
  LOG_IN_GOOGLE_PHOTOS,
  LOG_OUT_GOOGLE_PHOTOS
} from './App.constants';

import {
  getAuthtoken,
  refreshAuthToken
} from '../Board/GooglePhotosSearch/googlePhotosSearch.auth';

export function updateDisplaySettings(payload = {}) {
  return {
    type: UPDATE_DISPLAY_SETTINGS,
    payload
  };
}

export function updateNavigationSettings(payload = {}) {
  return {
    type: UPDATE_NAVIGATION_SETTINGS,
    payload
  };
}

export function finishFirstVisit() {
  return {
    type: FINISH_FIRST_VISIT
  };
}

export function updateUserData(userData) {
  return {
    type: UPDATE_USER_DATA,
    userData
  };
}

export function logInGooglePhotosAuth({ googlePhotosCode, refreshToken }) {
  return dispatch => {
    try {
      if (googlePhotosCode) {
        getAuthtoken(googlePhotosCode)
          .then(googlePhotosAuth =>
            dispatch({
              type: LOG_IN_GOOGLE_PHOTOS,
              googlePhotosAuth: googlePhotosAuth.tokens
            })
          )
          .catch(error => {
            throw error;
          });
      } else if (refreshToken) {
        console.log('refreshToken', refreshToken);
        refreshAuthToken(refreshToken)
          .then(googlePhotosAuth => {
            dispatch({
              type: LOG_IN_GOOGLE_PHOTOS,
              googlePhotosAuth: googlePhotosAuth
            });
          })
          .catch(error => {
            throw error;
          });
      }
    } catch (error) {
      window.alert(error.message);
      console.log('logInGooglePhotosAuth error:', error);
    }
  };
}

export function logOutGooglePhotos() {
  return {
    type: LOG_OUT_GOOGLE_PHOTOS
  };
}
