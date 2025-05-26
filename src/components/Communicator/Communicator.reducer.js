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
  ADD_DEFAULT_BOARD_INCLUDED,
  UPDATE_DEFAULT_BOARDS_INCLUDED,
  CREATE_API_COMMUNICATOR_SUCCESS,
  CREATE_API_COMMUNICATOR_FAILURE,
  CREATE_API_COMMUNICATOR_STARTED,
  UPDATE_API_COMMUNICATOR_SUCCESS,
  UPDATE_API_COMMUNICATOR_FAILURE,
  UPDATE_API_COMMUNICATOR_STARTED,
  GET_API_MY_COMMUNICATORS_SUCCESS,
  GET_API_MY_COMMUNICATORS_FAILURE,
  GET_API_MY_COMMUNICATORS_STARTED,
  SYNC_COMMUNICATORS
} from './Communicator.constants';
import { LOGIN_SUCCESS, LOGOUT } from '../Account/Login/Login.constants';
import moment from 'moment';
import { deepCopy } from '../../helpers';

export const defaultCommunicatorID = 'cboard_default';
const initialState = {
  communicators: deepCopy(defaultCommunicators),
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
      return {
        ...initialState,
        communicators: deepCopy(defaultCommunicators)
      };

    case IMPORT_COMMUNICATOR:
      return {
        ...state,
        communicators: state.communicators.concat(action.payload)
      };

    case CREATE_COMMUNICATOR:
      const newCommunicator = {
        ...action.payload,
        lastEdited: moment().format()
      };
      return {
        ...state,
        communicators: state.communicators.concat(newCommunicator)
      };

    case EDIT_COMMUNICATOR:
      const communicatorIndex = state.communicators.findIndex(
        c => c.id === action.payload.id
      );
      let newState = { ...state };

      if (communicatorIndex >= 0) {
        const updatedCommunicator = {
          ...action.payload,
          lastEdited: moment().format()
        };
        newState.communicators[communicatorIndex] = updatedCommunicator;
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
          updatedCommunicators[index].lastEdited = moment().format();
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
            dupdatedCommunicators[index].lastEdited = moment().format();
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
            updatedCommunicators[index].lastEdited = moment().format();
            return {
              ...state,
              communicators: updatedCommunicators
            };
          }
        }
      }
      return { ...state };

    case ADD_DEFAULT_BOARD_INCLUDED:
      if (activeCommunicator) {
        const index = state.communicators.indexOf(activeCommunicator);
        if (index !== -1) {
          const BOARD_ALREADY_INCLUDED_DATA = {
            nameOnJSON: 'advanced',
            homeBoard: 'root'
          };

          const hasValidDefaultBoardsIncluded = !!activeCommunicator
            .defaultBoardsIncluded?.length;

          const defaultBoardsIncluded = hasValidDefaultBoardsIncluded
            ? [
                ...activeCommunicator.defaultBoardsIncluded,
                action.defaultBoardData
              ]
            : [BOARD_ALREADY_INCLUDED_DATA, action.defaultBoardData];

          const updatedCommunicators = [...state.communicators];
          updatedCommunicators[
            index
          ].defaultBoardsIncluded = defaultBoardsIncluded;
          updatedCommunicators[index].lastEdited = moment().format();

          return {
            ...state,
            communicators: updatedCommunicators
          };
        }
      }
      return { ...state };

    case UPDATE_DEFAULT_BOARDS_INCLUDED:
      if (activeCommunicator) {
        const index = state.communicators.indexOf(activeCommunicator);
        if (index !== -1) {
          const updatedCommunicators = [...state.communicators];
          updatedCommunicators[index].defaultBoardsIncluded =
            action.defaultBoardsIncluded;
          updatedCommunicators[index].lastEdited = moment().format();

          return {
            ...state,
            communicators: updatedCommunicators
          };
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
            ? {
                ...communicator,
                id: action.communicator.id,
                lastEdited: action.communicator.lastEdited
              }
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
        isFetching: false,
        communicators: state.communicators.map(communicator =>
          communicator.id === action.communicator.id
            ? {
                ...communicator,
                lastEdited: action.communicator.lastEdited
              }
            : communicator
        )
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
      return {
        ...state,
        isFetching: false
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
    case SYNC_COMMUNICATORS:
      return {
        ...state,
        communicators: action.communicators,
        activeCommunicatorId: action.activeCommunicatorId
      };
    default:
      return state;
  }
}

export default communicatorReducer;
