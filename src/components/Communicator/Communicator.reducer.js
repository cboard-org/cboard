import defaultCommunicators from '../../api/communicators.json';

import {
  IMPORT_COMMUNICATOR,
  CREATE_COMMUNICATOR,
  EDIT_COMMUNICATOR,
  DELETE_COMMUNICATOR,
  CHANGE_COMMUNICATOR,
  CREATE_API_COMMUNICATOR_SUCCESS,
  CREATE_API_COMMUNICATOR_FAILURE,
  CREATE_API_COMMUNICATOR_STARTED,
  UPDATE_API_COMMUNICATOR_SUCCESS,
  UPDATE_API_COMMUNICATOR_FAILURE,
  UPDATE_API_COMMUNICATOR_STARTED,
  GET_API_COMMUNICATOR_SUCCESS,
  GET_API_COMMUNICATOR_FAILURE,
  GET_API_COMMUNICATOR_STARTED
} from './Communicator.constants';
import { LOGIN_SUCCESS, LOGOUT } from '../Account/Login/Login.constants';

const defaultCommunicatorID = 'cboard_default';
const initialState = {
  communicators: defaultCommunicators,
  activeCommunicatorId: defaultCommunicatorID
};

function communicatorReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      const userCommunicators = action.payload.communicators || [];
      const activeCommunicatorId = userCommunicators.length
        ? userCommunicators[userCommunicators.length - 1].id
        : state.activeCommunicatorId;
      return {
        ...state,
        activeCommunicatorId,
        communicators: state.communicators.concat(userCommunicators)
      };

    case LOGOUT:
      return initialState;

    case IMPORT_COMMUNICATOR:
      return {
        ...state,
        communicators: state.communicators.concat(action.payload)
      };

    case CREATE_COMMUNICATOR:
      return {
        ...state,
        communicators: state.communicators.concat(action.payload)
      };

    case EDIT_COMMUNICATOR:
      const communicatorIndex = state.communicators.findIndex(
        c => c.id === action.payload.id
      );
      let newState = { ...state };

      if (communicatorIndex >= 0) {
        newState.communicators[communicatorIndex] = action.payload;
      }

      return newState;

    case DELETE_COMMUNICATOR:
      return {
        ...state,
        communicators: state.communicators.filter(
          ({ id }) => id !== action.payload
        )
      };

    case CHANGE_COMMUNICATOR:
      return {
        ...state,
        activeCommunicatorId: state.communicators.find(
          ({ id }) => id === action.payload
        )
          ? action.payload
          : state.activeCommunicatorId
      };

    case CREATE_API_COMMUNICATOR_SUCCESS:
      return {
        ...state,
        isFetching: false
      };
    case CREATE_API_COMMUNICATOR_FAILURE:
      return {
        ...state,
        isFetching: false
      };
    case CREATE_API_COMMUNICATOR_STARTED:
      return {
        ...state,
        isFetching: true
      };
    case UPDATE_API_COMMUNICATOR_SUCCESS:
      return {
        ...state,
        isFetching: false
      };
    case UPDATE_API_COMMUNICATOR_FAILURE:
      return {
        ...state,
        isFetching: false
      };
    case UPDATE_API_COMMUNICATOR_STARTED:
      return {
        ...state,
        isFetching: true
      };
    case GET_API_COMMUNICATOR_SUCCESS:
      return {
        ...state,
        isFetching: false
      };
    case GET_API_COMMUNICATOR_FAILURE:
      return {
        ...state,
        isFetching: false
      };
    case GET_API_COMMUNICATOR_STARTED:
      return {
        ...state,
        isFetching: true
      };
    default:
      return state;
  }
}

export default communicatorReducer;
