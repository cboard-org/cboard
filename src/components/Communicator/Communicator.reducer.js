import defaultCommunicators from '../../api/communicators.json';

import {
  IMPORT_COMMUNICATOR,
  CREATE_COMMUNICATOR,
  EDIT_COMMUNICATOR,
  DELETE_COMMUNICATOR,
  CHANGE_COMMUNICATOR
} from './Communicator.constants';

const defaultCommunicatorID = 'cboard_default';
const initialState = {
  communicators: defaultCommunicators,
  activeCommunicatorId: defaultCommunicatorID
};

function communicatorReducer(state = initialState, action) {
  switch (action.type) {
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

    default:
      return state;
  }
}

export default communicatorReducer;
