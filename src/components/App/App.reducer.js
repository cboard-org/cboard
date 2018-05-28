import { FINISH_FIRST_VISIT, UPDATE_CONNECTIVITY } from './App.constants';
import { LOGIN_SUCCESS, LOGOUT } from '../Account/Login/Login.constants';

const initialState = {
  isConnected: true,
  isFirstVisit: true,
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
