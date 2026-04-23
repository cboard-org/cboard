import { DEFAULT_FONT_FAMILY } from '../../../providers/ThemeProvider/ThemeProvider.constants';
import { LOGIN_SUCCESS, LOGOUT } from '../../Account/Login/Login.constants';
import { DISPLAY_SIZE_STANDARD } from '../../Settings/Display/Display.constants';
import { NAVIGATION_BUTTONS_STYLE_SIDES } from '../../Settings/Navigation/Navigation.constants';
import {
  FINISH_FIRST_VISIT,
  START_COMMUNICATION_SESSION,
  CLEAR_COMMUNICATION_SESSION,
  UPDATE_CONNECTIVITY,
  UPDATE_DISPLAY_SETTINGS,
  UPDATE_NAVIGATION_SETTINGS
} from '../App.constants';
import appReducer from '../App.reducer';

let mockApp, uData, initialState;

describe('reducer', () => {
  beforeEach(() => {
    initialState = {
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
        isAnalyticsTourEnabled: true,
        isSymbolSearchTourEnabled: true
      },
      displaySettings: {
        uiSize: DISPLAY_SIZE_STANDARD,
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: DISPLAY_SIZE_STANDARD,
        hideOutputActive: false,
        increaseOutputButtons: false,
        labelPosition: 'Below',
        darkThemeActive: false
      },
      navigationSettings: {
        active: false,
        bigScrollButtonsActive: false,
        caBackButtonActive: false,
        navigationButtonsStyle: NAVIGATION_BUTTONS_STYLE_SIDES,
        liveMode: false,
        shareShowActive: false,
        quickUnlockActive: false,
        removeOutputActive: false,
        vocalizeFolders: false,
        quietBuilderMode: false,
        improvePhraseActive: false,
        pinLockEnabled: false,
        pinCode: ''
      },
      symbolsSettings: {
        arasaacActive: false
      },
      sessionId: null,
      userData: {}
    };
    uData = { name: 'martin bedouret', email: 'anything@cboard.io' };
    mockApp = {
      displaySettings: {
        uiSize: 'Standard',
        hideOutputActive: false,
        increaseOutputButtons: false,
        labelPosition: 'Below',
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: 'Standard',
        darkThemeActive: false
      },
      isConnected: true,
      isFirstVisit: false,
      navigationSettings: {
        active: false,
        bigScrollButtonsActive: false,
        caBackButtonActive: false,
        navigationButtonsStyle: NAVIGATION_BUTTONS_STYLE_SIDES,
        liveMode: false,
        shareShowActive: false,
        quickUnlockActive: false,
        removeOutputActive: false,
        vocalizeFolders: false,
        quietBuilderMode: false,
        improvePhraseActive: false,
        pinLockEnabled: false,
        pinCode: ''
      },
      userData: uData
    };
  });
  it('should return the initial state', () => {
    expect(appReducer(undefined, {})).toEqual(initialState);
  });
  it('should handle login ', () => {
    const login = {
      type: LOGIN_SUCCESS,
      payload: uData
    };
    expect(appReducer(initialState, login)).toEqual({
      ...initialState,
      userData: uData,
      isFirstVisit: false
    });
  });
  it('should handle logout', () => {
    const logout = {
      type: LOGOUT
    };
    expect(appReducer(initialState, logout)).toEqual(initialState);
  });
  it('should handle updateDisplaySettings', () => {
    const updateDisplaySettings = {
      type: UPDATE_DISPLAY_SETTINGS,
      payload: mockApp.displaySettings
    };
    expect(appReducer(initialState, updateDisplaySettings)).toEqual({
      ...initialState,
      displaySettings: mockApp.displaySettings
    });
  });
  it('should handle updateNavigationSettings', () => {
    const updateNavigationSettings = {
      type: UPDATE_NAVIGATION_SETTINGS,
      payload: mockApp.navigationSettings
    };
    expect(appReducer(initialState, updateNavigationSettings)).toEqual({
      ...initialState,
      navigationSettings: mockApp.navigationSettings
    });
  });
  it('should handle finishFirstVisit ', () => {
    const finishFirstVisit = {
      type: FINISH_FIRST_VISIT
    };
    expect(appReducer(initialState, finishFirstVisit)).toEqual({
      ...initialState,
      isFirstVisit: false
    });
  });
  it('should handle updateConnectivity', () => {
    const updateConnectivity = {
      type: UPDATE_CONNECTIVITY,
      payload: false
    };
    expect(appReducer(initialState, updateConnectivity)).toEqual({
      ...initialState,
      isConnected: false
    });
  });
  it('should handle start communication session', () => {
    const startCommunicationSession = {
      type: START_COMMUNICATION_SESSION,
      sessionId: 'session_123'
    };
    expect(appReducer(initialState, startCommunicationSession)).toEqual({
      ...initialState,
      sessionId: 'session_123'
    });
  });
  it('should handle clear communication session', () => {
    const stateWithSession = {
      ...initialState,
      sessionId: 'session_123'
    };
    const clearCommunicationSession = {
      type: CLEAR_COMMUNICATION_SESSION
    };
    expect(appReducer(stateWithSession, clearCommunicationSession)).toEqual({
      ...initialState,
      sessionId: null
    });
  });
});
