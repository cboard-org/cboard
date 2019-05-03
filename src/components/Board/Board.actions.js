
import {
  IMPORT_BOARDS,
  ADD_BOARDS,
  CHANGE_BOARD,
  SWITCH_BOARD,
  PREVIOUS_BOARD,
  CREATE_BOARD,
  UPDATE_BOARD,
  CREATE_TILE,
  DELETE_TILES,
  EDIT_TILES,
  FOCUS_TILE,
  CHANGE_OUTPUT,
  REPLACE_BOARD,
  CREATE_API_BOARD_SUCCESS,
  CREATE_API_BOARD_FAILURE,
  CREATE_API_BOARD_STARTED,
  UPDATE_API_BOARD_SUCCESS,
  UPDATE_API_BOARD_FAILURE,
  UPDATE_API_BOARD_STARTED,
  GET_API_BOARD_SUCCESS,
  GET_API_BOARD_FAILURE,
  GET_API_BOARD_STARTED
} from './Board.constants';

import API from '../../api';

import {
  updateApiCommunicator,
  createApiCommunicator,
  replaceBoardCommunicator,
  upsertCommunicator
} from '../Communicator/Communicator.actions';

export function importBoards(boards) {
  return {
    type: IMPORT_BOARDS,
    boards
  };
}

export function addBoards(boards) {
  return {
    type: ADD_BOARDS,
    boards
  };
}

export function replaceBoard(prev, current) {
  return {
    type: REPLACE_BOARD,
    payload: { prev, current }
  };
}

export function createBoard(boardData) {
  return {
    type: CREATE_BOARD,
    boardData
  };
}
export function updateBoard(boardData) {
  return {
    type: UPDATE_BOARD,
    boardData
  };
}

export function switchBoard(boardId) {
  return {
    type: SWITCH_BOARD,
    boardId
  };
}

export function changeBoard(boardId) {
  return {
    type: CHANGE_BOARD,
    boardId
  };
}

export function previousBoard() {
  return {
    type: PREVIOUS_BOARD
  };
}

export function createTile(tile, boardId) {
  return {
    type: CREATE_TILE,
    tile,
    boardId
  };
}

export function deleteTiles(tiles, boardId) {
  return {
    type: DELETE_TILES,
    tiles,
    boardId
  };
}

export function editTiles(tiles, boardId) {
  return {
    type: EDIT_TILES,
    tiles,
    boardId
  };
}

export function focusTile(tileId, boardId) {
  return {
    type: FOCUS_TILE,
    tileId,
    boardId
  };
}

export function changeOutput(output) {
  return {
    type: CHANGE_OUTPUT,
    output
  };
}

export function getApiBoardSuccess(board, boardId) {
  return {
    type: GET_API_BOARD_SUCCESS,
    board,
    boardId
  };
}

export function getApiBoardStarted() {
  return {
    type: GET_API_BOARD_STARTED
  };
}

export function getApiBoardFailure(message) {
  return {
    type: GET_API_BOARD_FAILURE,
    message
  };
}

export function createApiBoardSuccess(board, boardId) {
  return {
    type: CREATE_API_BOARD_SUCCESS,
    board,
    boardId
  };
}

export function createApiBoardStarted() {
  return {
    type: CREATE_API_BOARD_STARTED
  };
}

export function createApiBoardFailure(message) {
  return {
    type: CREATE_API_BOARD_FAILURE,
    message
  };
}

export function updateApiBoardSuccess(board) {
  return {
    type: UPDATE_API_BOARD_SUCCESS,
    board
  };
}

export function updateApiBoardStarted() {
  return {
    type: UPDATE_API_BOARD_STARTED
  };
}

export function updateApiBoardFailure(message) {
  return {
    type: UPDATE_API_BOARD_FAILURE,
    message
  };
}

export function getApiBoard(boardId) {
  return (dispatch) => {
    dispatch(getApiBoardStarted());
    return API.getBoard(boardId)
      .then(res => {
        dispatch(getApiBoardSuccess(res, boardId));
      })
      .catch(err => {
        dispatch(getApiBoardFailure(err.message));
      });
  };
}

export function createApiBoard(boardData, boardId) {
  return (dispatch) => {
    dispatch(createApiBoardStarted());
    boardData = {
      ...boardData,
      isPublic: false
    };
    return API.createBoard(boardData)
      .then((res) => {
        dispatch(createApiBoardSuccess(res, boardId));
        return res;
      })
      .catch((err) => {
        dispatch(createApiBoardFailure(err.message));
        return err;
      });
  };
}

export function updateApiBoard(boardData) {
  return (dispatch) => {
    dispatch(updateApiBoardStarted());
    boardData = {
      ...boardData,
      isPublic: false
    };
    return API.updateBoard(boardData)
      .then(res => {
        dispatch(updateApiBoardSuccess(res));
      })
      .catch(err => {
        dispatch(updateApiBoardFailure(err.message));
      });
  };
}

export function updateApiObjects(
  childBoard,
  parentBoard,
  createCommunicator = false,
  createParentBoard = false) {

  return (dispatch, getState) => {
    //create child board
    return dispatch(createApiBoard(childBoard, childBoard.id))
      .then((res) => {
        const updatedChildBoardId = res.id;
        //create - update parent board 
        return (createParentBoard)
          ? dispatch(createApiBoard(parentBoard, parentBoard.id))
          : dispatch(updateApiBoard(parentBoard))
          .then((res) => {
            const updatedParentBoardId = res.id;
            //add new boards to the active communicator
            dispatch(replaceBoardCommunicator(childBoard.id, updatedChildBoardId));
            if (parentBoard.id !== updatedParentBoardId) {
              dispatch(replaceBoardCommunicator(parentBoard.id, updatedParentBoardId));
            }
            //check if parent board is the root board of the communicator
            const comm = getState().communicator.communicators.find(
              communicator => communicator.id === getState().communicator.activeCommunicatorId);
            if (comm.rootBoard === parentBoard.id) {
              comm.rootBoard = updatedParentBoardId;
              comm.activeBoardId = updatedParentBoardId;
              dispatch(upsertCommunicator(comm));
            }
            return (createCommunicator)
              ? dispatch(createApiCommunicator(comm, comm.id))
              : dispatch(updateApiCommunicator(comm))
              ;
          });
      });
  };
}
