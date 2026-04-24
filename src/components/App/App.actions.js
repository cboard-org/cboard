import API from '../../api';
import {
  FINISH_FIRST_VISIT,
  UPDATE_DISPLAY_SETTINGS,
  UPDATE_NAVIGATION_SETTINGS,
  UPDATE_USER_DATA,
  DISABLE_TOUR,
  ENABLE_ALL_TOURS,
  SET_UNLOGGED_USER_LOCATION,
  UPDATE_SYMBOLS_SETTINGS,
  UPDATE_CONNECTIVITY
} from './App.constants';

import { updateIsInFreeCountry } from '../../providers/SubscriptionProvider/SubscriptionProvider.actions';
import { changeElevenLabsApiKey } from '../../providers/SpeechProvider/SpeechProvider.actions';
import tts from '../../providers/SpeechProvider/tts';

export function updateConnectivity({ isConnected = false }) {
  return {
    type: UPDATE_CONNECTIVITY,
    payload: isConnected
  };
}

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

export function updateSymbolsSettings(payload = {}) {
  return {
    type: UPDATE_SYMBOLS_SETTINGS,
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

export function setUnloggedUserLocation(location) {
  return {
    type: SET_UNLOGGED_USER_LOCATION,
    location
  };
}

export function updateLoggedUserLocation() {
  return async (dispatch, getState) => {
    const {
      app: { userData }
    } = getState();
    if (!userData) return;
    try {
      const { id, location } = userData;
      const APIGetAndUpdateLocation = async () => {
        const { location: userLocation } = await API.updateUser({
          id: id,
          location: {}
        });
        return userLocation;
      };

      if (location) return;
      const userLocation = await APIGetAndUpdateLocation();
      if (userLocation) {
        dispatch(updateUserData({ ...userData, location: userLocation }));
        dispatch(updateIsInFreeCountry());
        return;
      }
      throw new Error('unable to get location');
    } catch {
      console.error('error during localization of the logged user');
    }
  };
}

export function updateUserDataFromAPI() {
  return async (dispatch, getState) => {
    const {
      app: { userData }
    } = getState();
    if (!userData) return;
    try {
      const { id } = userData;
      const newUserData = await API.getUserData(id);
      dispatch(updateUserData({ ...userData, ...newUserData }));

      if (newUserData.settings?.speech?.elevenLabsApiKey) {
        dispatch(
          changeElevenLabsApiKey(newUserData.settings.speech.elevenLabsApiKey)
        );
        tts.initElevenLabsInstance(
          newUserData.settings.speech.elevenLabsApiKey
        );
      }
    } catch (error) {
      console.error(error);
      //could show an alert and offer the posibility of rerun de update.
    }
  };
}

export function updateUnloggedUserLocation() {
  return async (dispatch, getState) => {
    const {
      app: { unloggedUserLocation }
    } = getState();
    try {
      if (unloggedUserLocation) return;
      const location = await API.getUserLocation();
      if (location) {
        dispatch(setUnloggedUserLocation(location));
        dispatch(updateIsInFreeCountry());
        return;
      }
      throw new Error('unable to get location');
    } catch {
      console.error('error during localization of the unlogged user');
    }
  };
}
