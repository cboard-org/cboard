import { FINISH_FIRST_VISIT, UPDATE_CONNECTIVITY } from './App.constants';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR
} from '../Account/Login/Login.constants';
import {
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_ERROR
} from '../Account/SignUp/SignUp.constants';

const initialState = {
  isConnected: true,
  isFirstVisit: true,
  isLogging: false,
  isSigningUp: false,
  loginStatus: {},
  signUpStatus: {}
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
    case LOGIN_ERROR:
      return {
        ...state,
        loginStatus: action.payload || {},
        isLogging: false
      };
    case SIGNUP_REQUEST:
      return {
        ...state,
        signUpStatus: {},
        isSigningUp: true
      };
    case SIGNUP_SUCCESS:
    case SIGNUP_ERROR:
      return {
        ...state,
        signUpStatus: action.payload || {},
        isSigningUp: false
      };
    default:
      return state;
  }
}

export default appReducer;
