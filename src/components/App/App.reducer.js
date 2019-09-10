import {
  FINISH_FIRST_VISIT,
  UPDATE_CONNECTIVITY,
  UPDATE_DISPLAY_SETTINGS,
  UPDATE_NAVIGATION_SETTINGS,
  UPDATE_USER_DATA
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
    active: false,
    caBackButtonActive: false,
    quickUnlockActive: false,
    removeOutputActive: false
  },
  userData: {}
};

function appReducer(state = initialState, action) {
  let displaySettings = { ...state.displaySettings };
  let navigationSettings = { ...state.navigationSettings };

  switch (action.type) {
    case UPDATE_DISPLAY_SETTINGS:
      displaySettings = { ...state.displaySettings, ...action.payload };
      return {
        ...state,
        displaySettings
      };
    case UPDATE_NAVIGATION_SETTINGS:
      navigationSettings = {
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
      const settings = action.payload.settings || {};
      const { display, navigation } = settings;

      displaySettings = { ...state.displaySettings };
      navigationSettings = { ...state.navigationSettings };

      if (display) {
        displaySettings = { ...displaySettings, ...display };
      }

      if (navigation) {
        navigationSettings = { ...navigationSettings, ...navigation };
      }

      return {
        ...state,
        isFirstVisit: false,
        displaySettings,
        navigationSettings,
        userData: action.payload || {}
      };
    case LOGOUT:
      return {
        ...state,
        userData: {}
      };
    case UPDATE_USER_DATA:
      return {
        ...state,
        userData: action.userData
      };
    default:
      return state;
  }
}

export default appReducer;
