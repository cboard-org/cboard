import {
  FINISH_FIRST_VISIT,
  UPDATE_CONNECTIVITY,
  UPDATE_DISPLAY_SETTINGS
} from './App.constants';
import { LOGIN_SUCCESS, LOGOUT } from '../Account/Login/Login.constants';
import { DISPLAY_SIZE_STANDARD } from '../Settings/Display/Display.constants';

const initialState = {
  isConnected: true,
  isFirstVisit: true,
  displaySettings: {
    boardElementsSize: DISPLAY_SIZE_STANDARD,
    boardFontSize: DISPLAY_SIZE_STANDARD,
    settingsSize: DISPLAY_SIZE_STANDARD,
    pictogramsSize: DISPLAY_SIZE_STANDARD
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
