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
  GET_API_MY_COMMUNICATORS_STARTED
} from './Communicator.constants';
import { defaultCommunicatorID } from './Communicator.reducer';
import API from '../../api';
import shortid from 'shortid';
import { removeBoardsFromList } from '../Board/Board.actions';
import { ALL_DEFAULT_BOARDS } from '../../helpers';

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

export function upsertApiCommunicator(communicator) {
  return async (dispatch, getState) => {
    const {
      communicator: { communicators }
    } = getState();
    const SHORT_ID_MAX_LENGTH = 15;

    // If the communicator is not on the local state return
    if (!communicators.find(c => c.id === communicator.id))
      return Promise.reject({
        message: 'Communicator not found on local state'
      });

    return communicator.id.length < SHORT_ID_MAX_LENGTH ||
      communicator.id === defaultCommunicatorID
      ? dispatch(createApiCommunicator(communicator, communicator.id)).catch(
          error => {
            throw new Error(error);
          }
        )
      : dispatch(updateApiCommunicator(communicator)).catch(error => {
          throw new Error(error);
        });
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

export function deleteBoardCommunicator(boardId) {
  return {
    type: DELETE_BOARD_COMMUNICATOR,
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

export function getApiMyCommunicatorsSuccess(communicators) {
  return {
    type: GET_API_MY_COMMUNICATORS_SUCCESS,
    communicators
  };
}

export function getApiMyCommunicatorsStarted() {
  return {
    type: GET_API_MY_COMMUNICATORS_STARTED
  };
}

export function getApiMyCommunicatorsFailure(message) {
  return {
    type: GET_API_MY_COMMUNICATORS_FAILURE,
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

export function verifyAndUpsertCommunicator(
  communicator,
  needToChangeCommunicator = true
) {
  return (dispatch, getState) => {
    const {
      app: { userData }
    } = getState();

    const getActiveCommunicator = getState => {
      return getState().communicator.communicators.find(
        c => c.id === getState().communicator.activeCommunicatorId
      );
    };

    const updatedCommunicatorData = communicator.hasOwnProperty('id')
      ? { ...communicator }
      : { ...getActiveCommunicator(getState) };

    if (
      'name' in userData &&
      'email' in userData &&
      communicator.email !== userData.email
    ) {
      //need to create a new communicator
      updatedCommunicatorData.author = userData.name;
      updatedCommunicatorData.email = userData.email;
      updatedCommunicatorData.id = shortid.generate();
      updatedCommunicatorData.boards = [...communicator.boards];

      if (!!communicator.defaultBoardsIncluded) {
        updatedCommunicatorData.defaultBoardsIncluded = communicator.defaultBoardsIncluded.map(
          item => ({ ...item })
        );
      }
    }

    dispatch(upsertCommunicator(updatedCommunicatorData));

    if (needToChangeCommunicator)
      dispatch(changeCommunicator(updatedCommunicatorData.id));

    return updatedCommunicatorData;
  };
}

/*
 * Thunk functions
 */

export function getApiMyCommunicators() {
  return (dispatch, getState) => {
    dispatch(getApiMyCommunicatorsStarted());
    return API.getCommunicators()
      .then(res => {
        const activeCommunicator =
          res.data.find(
            communicator =>
              communicator.id === getState().communicator.activeCommunicator
          ) ?? res.data[res.data.length - 1];
        const defaultBoardBlackList = activeCommunicator?.defaultBoardBlackList;
        dispatch(removeBoardsFromList(defaultBoardBlackList));
        dispatch(getApiMyCommunicatorsSuccess(res));
        return res;
      })
      .catch(err => {
        dispatch(getApiMyCommunicatorsFailure(err.message));
        throw new Error(err.message);
      });
  };
}

export function createApiCommunicator(communicatorData, communicatorId) {
  return dispatch => {
    dispatch(createApiCommunicatorStarted());
    communicatorData = {
      ...communicatorData,
      isPublic: false
    };
    return API.createCommunicator(communicatorData)
      .then(res => {
        dispatch(createApiCommunicatorSuccess(res, communicatorId));
        return res;
      })
      .catch(err => {
        dispatch(createApiCommunicatorFailure(err.message));
        throw new Error(err.message);
      });
  };
}

export function updateApiCommunicator(communicatorData) {
  return async dispatch => {
    dispatch(updateApiCommunicatorStarted());
    return API.updateCommunicator(communicatorData)
      .then(res => {
        dispatch(updateApiCommunicatorSuccess(res));
        return res;
      })
      .catch(err => {
        dispatch(updateApiCommunicatorFailure(err.message));
        throw new Error(err.message);
      });
  };
}

export function addDefaultBoardIncluded(defaultBoardData) {
  return {
    type: ADD_DEFAULT_BOARD_INCLUDED,
    defaultBoardData
  };
}

export function updateDefaultBoardsIncluded(boardAlreadyIncludedData) {
  return {
    type: UPDATE_DEFAULT_BOARDS_INCLUDED,
    defaultBoardsIncluded: boardAlreadyIncludedData
  };
}

export function concatDefaultBoardIdToBlacklist(boardId) {
  const getActiveCommunicator = getState => {
    return getState().communicator.communicators.find(
      c => c.id === getState().communicator.activeCommunicatorId
    );
  };
  return (dispatch, getState) => {
    if (!ALL_DEFAULT_BOARDS.includes(boardId)) return;
    const updatedCommunicatorData = { ...getActiveCommunicator(getState) };

    const concatBoardIdIfNecessary = () => {
      if (!updatedCommunicatorData?.defaultBoardBlackList.includes(boardId))
        return updatedCommunicatorData?.defaultBoardBlackList.concat(boardId);
      return updatedCommunicatorData?.defaultBoardBlackList;
    };

    updatedCommunicatorData.defaultBoardBlackList = updatedCommunicatorData?.defaultBoardBlackList
      ? concatBoardIdIfNecessary()
      : [boardId];

    dispatch(verifyAndUpsertCommunicator(updatedCommunicatorData));
    return dispatch(upsertApiCommunicator(updatedCommunicatorData))
      .then(() => {
        return updatedCommunicatorData?.defaultBoardBlackList;
      })
      .catch(e => {
        console.error(e.message);
      });
  };
}
