import {
  FINISH_FIRST_VISIT,
  UPDATE_CONNECTIVITY,
  UPDATE_DISPLAY_SETTINGS,
  UPDATE_NAVIGATION_SETTINGS
} from './App.constants';
import { LOGIN_SUCCESS, LOGOUT } from '../Account/Login/Login.constants';
import { DISPLAY_SIZE_STANDARD } from '../Settings/Display/Display.constants';

const initialState = {
  isConnected: true,
  isFirstVisit: true,
  displaySettings: {
    uiSize: DISPLAY_SIZE_STANDARD,
    fontSize: DISPLAY_SIZE_STANDARD
  },
  navigationSettings: {
    active: false
  },
  userData: {}
};

function appReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_DISPLAY_SETTINGS:
      const displaySettings = { ...state.displaySettings, ...action.payload };
      return {
        ...state,
        displaySettings
      };
    case UPDATE_NAVIGATION_SETTINGS:
      const navigationSettings = {
        ...state.navigationSettings,
        ...action.payload
      };
      return {
        ...state,
        navigationSettings
      };
    case UPDATE_CONNECTIVITY:
      return {
        ...state,
        isConnected: action.payload
      };
    case FINISH_FIRST_VISIT:
      return {
        ...state,
        isFirstVisit: false
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isFirstVisit: false,
        userData: action.payload || {}
      };
    case LOGOUT:
      return {
        ...state,
        userData: {}
      };
    default:
      return state;
  }
}

export default appReducer;
