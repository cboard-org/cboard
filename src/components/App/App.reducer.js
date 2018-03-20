import { FINISH_FIRST_VISIT } from './App.constants';
import {
  LOGIN_ERROR,
  LOGIN_REQUEST,
  LOGIN_SUCCESS
} from '../Accounts/Login/Login.constants';
import {
  SIGNUP_ERROR,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS
} from '../Accounts/SignUp/SignUp.constants';

const initialState = {
  isFirstVisit: true,
  isLogging: false,
  isSigningUp: false
};

function appReducer(state = initialState, action) {
  switch (action.type) {
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
        loginStatus: action.payload,
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
        signUpStatus: action.payload,
        isSigningUp: false
      };
    default:
      return state;
  }
}

export default appReducer;
