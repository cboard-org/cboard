import {
  FINISH_FIRST_VISIT,
  UPDATE_DISPLAY_SETTINGS,
  UPDATE_NAVIGATION_SETTINGS,
  UPDATE_USER_DATA,
  DISABLE_TOUR,
  ENABLE_ALL_TOURS
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

export function disableTour(payload = {}) {
  return {
    type: DISABLE_TOUR,
    payload
  };
}

export function enableAllTours() {
  return {
    type: ENABLE_ALL_TOURS
  };
}

export function updateUserData(userData) {
  return {
    type: UPDATE_USER_DATA,
    userData
  };
}
