import {
  FINISH_FIRST_VISIT,
  UPDATE_CONNECTIVITY,
  UPDATE_DISPLAY_SETTINGS,
  UPDATE_NAVIGATION_SETTINGS,
  UPDATE_USER_DATA,
  DISABLE_TOUR,
  ENABLE_ALL_TOURS,
  SET_UNLOGGED_USER_LOCATION
} from './App.constants';
import { LOGIN_SUCCESS, LOGOUT } from '../Account/Login/Login.constants';
import {
  DISPLAY_SIZE_STANDARD,
  LABEL_POSITION_BELOW
} from '../Settings/Display/Display.constants';

import { DEFAULT_FONT_FAMILY } from './../../providers/ThemeProvider/ThemeProvider.constants';

const initialState = {
  isConnected: true,
  isFirstVisit: true,
  liveHelp: {
    isRootBoardTourEnabled: true,
    isUnlockedTourEnabled: true,
    isSettingsTourEnabled: true,
    communicatorTour: {
      isCommBoardsEnabled: true,
      isPublicBoardsEnabled: true,
      isAllMyBoardsEnabled: true
    },
    isAnalyticsTourEnabled: true
  },
  displaySettings: {
    uiSize: DISPLAY_SIZE_STANDARD,
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: DISPLAY_SIZE_STANDARD,
    hideOutputActive: false,
    increaseOutputButtons: false,
    labelPosition: LABEL_POSITION_BELOW,
    darkThemeActive: false
  },
  navigationSettings: {
    active: false,
    shareShowActive: false,
    caBackButtonActive: false,
    quickUnlockActive: false,
    removeOutputActive: false,
    vocalizeFolders: false,
    liveMode: false
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
    case DISABLE_TOUR:
      return {
        ...state,
        liveHelp: {
          ...state.liveHelp,
          ...action.payload
        }
      };
    case ENABLE_ALL_TOURS:
      return {
        ...state,
        liveHelp: {
          isRootBoardTourEnabled: true,
          isUnlockedTourEnabled: true,
          isSettingsTourEnabled: true,
          communicatorTour: {
            isCommBoardsEnabled: true,
            isPublicBoardsEnabled: true,
            isAllMyBoardsEnabled: true
          },
          isAnalyticsTourEnabled: true
        }
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
    case SET_UNLOGGED_USER_LOCATION:
      return {
        ...state,
        unloggedUserLocation: action.location
      };
    default:
      return state;
  }
}

export default appReducer;
