import {
  IMPORT_COMMUNICATOR,
  CREATE_COMMUNICATOR,
  EDIT_COMMUNICATOR,
  DELETE_COMMUNICATOR,
  CHANGE_COMMUNICATOR,
  ADD_BOARD_COMMUNICATOR,
  REPLACE_BOARD_COMMUNICATOR,
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

import API from '../../api';

export function importCommunicator(communicator) {
  return {
    type: IMPORT_COMMUNICATOR,
    payload: communicator
  };
}

export function createCommunicator(communicator) {
  return {
    type: CREATE_COMMUNICATOR,
    payload: communicator
  };
}

export function upsertCommunicator(communicator) {
  return (dispatch, getState) => {
    const {
      communicator: { communicators }
    } = getState();
    const action =
      communicators.findIndex(c => c.id === communicator.id) >= 0
        ? editCommunicator
        : createCommunicator;

    dispatch(action(communicator));
  };
}

export function editCommunicator(communicator) {
  return {
    type: EDIT_COMMUNICATOR,
    payload: communicator
  };
}

export function deleteCommunicator(id) {
  return {
    type: DELETE_COMMUNICATOR,
    payload: id
  };
}

export function changeCommunicator(id) {
  return {
    type: CHANGE_COMMUNICATOR,
    payload: id
  };
}

export function addBoardCommunicator(boardId) {
  return {
    type: ADD_BOARD_COMMUNICATOR,
    boardId
  };
}

export function replaceBoardCommunicator(prevBoardId, nextBoardId) {
  return {
    type: REPLACE_BOARD_COMMUNICATOR,
    prevBoardId,
    nextBoardId
  };
}

export function getApiCommunicatorSuccess(communicator, communicatorId) {
  return {
    type: GET_API_COMMUNICATOR_SUCCESS,
    communicator,
    communicatorId
  };
}

export function getApiCommunicatorStarted() {
  return {
    type: GET_API_COMMUNICATOR_STARTED
  };
}

export function getApiCommunicatorFailure(message) {
  return {
    type: GET_API_COMMUNICATOR_FAILURE,
    message
  };
}
export function createApiCommunicatorSuccess(communicator, communicatorId) {
  return {
    type: CREATE_API_COMMUNICATOR_SUCCESS,
    communicator,
    communicatorId
  };
}

export function createApiCommunicatorStarted() {
  return {
    type: CREATE_API_COMMUNICATOR_STARTED
  };
}

export function createApiCommunicatorFailure(message) {
  return {
    type: CREATE_API_COMMUNICATOR_FAILURE,
    message
  };
}
export function updateApiCommunicatorSuccess(communicator) {
  return {
    type: UPDATE_API_COMMUNICATOR_SUCCESS,
    communicator
  };
}

export function updateApiCommunicatorStarted() {
  return {
    type: UPDATE_API_COMMUNICATOR_STARTED
  };
}

export function updateApiCommunicatorFailure(message) {
  return {
    type: UPDATE_API_COMMUNICATOR_FAILURE,
    message
  };
}

/*
 * Thunk functions
 */

export function getApiCommunicator(communicatorId) {
  return (dispatch) => {
    dispatch(getApiCommunicatorStarted());
    return API.getCommunicator(communicatorId)
      .then(res => {
        dispatch(getApiCommunicatorSuccess(res, communicatorId));
        return res;
      })
      .catch(err => {
        dispatch(getApiCommunicatorFailure(err.message));
        return err;
      });
  };
}

export function createApiCommunicator(communicatorData, communicatorId) {
  return (dispatch) => {
    dispatch(createApiCommunicatorStarted());
    communicatorData = {
      ...communicatorData,
      isPublic: false
    };
    return API.createCommunicator(communicatorData)
      .then((res) => {
        dispatch(createApiCommunicatorSuccess(res, communicatorId));
        return res;
      })
      .catch((err) => {
        dispatch(createApiCommunicatorFailure(err.message));
        return err;
      });
  };
}

export function updateApiCommunicator(communicatorData) {
  return (dispatch) => {
    dispatch(updateApiCommunicatorStarted());
    return API.updateCommunicator(communicatorData)
      .then((res) => {
        dispatch(updateApiCommunicatorSuccess(res));
        return res;
      })
      .catch((err) => {
        dispatch(updateApiCommunicatorFailure(err.message));
        return err;
      });
  };
}

