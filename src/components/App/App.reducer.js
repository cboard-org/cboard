import { FINISH_FIRST_VISIT, UPDATE_CONNECTIVITY } from './App.constants';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT
} from '../Account/Login/Login.constants';
import {
  ACTIVATE_REQUEST,
  ACTIVATE_SUCCESS,
  ACTIVATE_ERROR
} from '../Account/Activate/Activate.constants';

const initialState = {
  isActivating: true,
  isConnected: true,
  isFirstVisit: true,
  isLogging: false,
  activationStatus: {},
  loginStatus: {},
  userData: {}
};

function appReducer(state = initialState, action) {
  switch (action.type) {
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
    case LOGIN_REQUEST:
      return {
        ...state,
        loginStatus: {},
        isLogging: true
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLogging: false,
        userData: action.payload || {}
      };
    case LOGIN_ERROR:
      return {
        ...state,
        loginStatus: action.payload || {},
        isLogging: false
      };
    case LOGOUT:
      return {
        ...state,
        userData: {}
      };
    case ACTIVATE_REQUEST:
      return {
        ...state,
        activationStatus: {},
        isActivating: true
      };
    case ACTIVATE_SUCCESS:
    case ACTIVATE_ERROR:
      return {
        ...state,
        activationStatus: action.payload || {},
        isActivating: false
      };
    default:
      return state;
  }
}

export default appReducer;
