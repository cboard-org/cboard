import {
  FINISH_FIRST_VISIT,
  UPDATE_DISPLAY_SETTINGS,
  UPDATE_NAVIGATION_SETTINGS,
  UPDATE_USER_DATA,
  LOG_IN_GOOGLE_PHOTOS,
  LOG_OUT_GOOGLE_PHOTOS
} from './App.constants';

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

export function logInGooglePhotosAuth(googlePhotosAuth) {
  return {
    type: LOG_IN_GOOGLE_PHOTOS,
    googlePhotosAuth
  };
}

export function logOutGooglePhotos() {
  return {
    type: LOG_OUT_GOOGLE_PHOTOS
  };
}
