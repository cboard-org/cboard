import defaultCommunicators from '../../api/communicators.json';

import {
  IMPORT_COMMUNICATOR,
  CREATE_COMMUNICATOR,
  EDIT_COMMUNICATOR,
  DELETE_COMMUNICATOR,
  CHANGE_COMMUNICATOR,
  ADD_BOARD_COMMUNICATOR,
  DELETE_BOARD_COMMUNICATOR,
  REPLACE_BOARD_COMMUNICATOR,
  CREATE_API_COMMUNICATOR_SUCCESS,
  CREATE_API_COMMUNICATOR_FAILURE,
  CREATE_API_COMMUNICATOR_STARTED,
  UPDATE_API_COMMUNICATOR_SUCCESS,
  UPDATE_API_COMMUNICATOR_FAILURE,
  UPDATE_API_COMMUNICATOR_STARTED,
  GET_API_MY_COMMUNICATORS_SUCCESS,
  GET_API_MY_COMMUNICATORS_FAILURE,
  GET_API_MY_COMMUNICATORS_STARTED
} from './Communicator.constants';
import { LOGIN_SUCCESS, LOGOUT } from '../Account/Login/Login.constants';

const defaultCommunicatorID = 'cboard_default';
const initialState = {
  communicators: defaultCommunicators,
  activeCommunicatorId: defaultCommunicatorID
};

function communicatorReducer(state = initialState, action) {
  const activeCommunicator = state.communicators.find(
    communicator => communicator.id === state.activeCommunicatorId
  );
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

    case ADD_BOARD_COMMUNICATOR:
      if (activeCommunicator) {
        const index = state.communicators.indexOf(activeCommunicator);
        if (index !== -1) {
          const updatedCommunicators = [...state.communicators];
          updatedCommunicators[index].boards.push(action.boardId);
          return {
            ...state,
            communicators: updatedCommunicators
          };
        }
      }
      return { ...state };

    case DELETE_BOARD_COMMUNICATOR:
      if (activeCommunicator) {
        const index = state.communicators.indexOf(activeCommunicator);
        if (index !== -1) {
          const dupdatedCommunicators = [...state.communicators];
          const bindex = activeCommunicator.boards.indexOf(action.boardId);
          if (bindex !== -1) {
            dupdatedCommunicators[index].boards.splice(bindex, 1);
            return {
              ...state,
              communicators: dupdatedCommunicators
            };
          }
        }
      }
      return { ...state };

    case REPLACE_BOARD_COMMUNICATOR:
      if (activeCommunicator) {
        const index = state.communicators.indexOf(activeCommunicator);
        if (index !== -1) {
          const updatedCommunicators = [...state.communicators];
          const boardIndex = updatedCommunicators[index].boards.indexOf(
            action.prevBoardId
          );
          if (boardIndex !== -1) {
            updatedCommunicators[index].boards.splice(
              boardIndex,
              1,
              action.nextBoardId
            );
            return {
              ...state,
              communicators: updatedCommunicators
            };
          }
        }
      }
      return { ...state };

    case CREATE_API_COMMUNICATOR_SUCCESS:
      // need to check if it was the active communicator as well
      return {
        ...state,
        isFetching: false,
        activeCommunicatorId:
          state.activeCommunicatorId === action.communicatorId
            ? action.communicator.id
            : state.activeCommunicatorId,
        communicators: state.communicators.map(communicator =>
          communicator.id === action.communicatorId
            ? { ...communicator, id: action.communicator.id }
            : communicator
        )
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
    case GET_API_MY_COMMUNICATORS_SUCCESS:
      let flag = false;
      const myCommunicators = [...state.communicators];
      for (let i = 0; i < action.communicators.data.length; i++) {
        for (let j = 0; j < myCommunicators.length; j++) {
          if (myCommunicators[j].id === action.communicators.data[i].id) {
            myCommunicators[j].boards = action.communicators.data[i].boards;
            flag = true;
            break;
          }
        }
        if (!flag) {
          myCommunicators.push(action.communicators.data[i]);
          flag = false;
        }
      }
      return {
        ...state,
        isFetching: false,
        communicators: myCommunicators
      };
    case GET_API_MY_COMMUNICATORS_FAILURE:
      return {
        ...state,
        isFetching: false
      };
    case GET_API_MY_COMMUNICATORS_STARTED:
      return {
        ...state,
        isFetching: true
      };
    default:
      return state;
  }
}

export default communicatorReducer;
