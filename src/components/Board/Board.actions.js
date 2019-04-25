import {
  IMPORT_BOARDS,
  ADD_BOARDS,
  CHANGE_BOARD,
  SWITCH_BOARD,
  PREVIOUS_BOARD,
  CREATE_BOARD,
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

export function createBoard(boardId, boardName, boardNameKey) {
  return {
    type: CREATE_BOARD,
    boardId,
    boardName,
    boardNameKey
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

export function updateApiBoardSuccess(board, boardId) {
  return {
    type: UPDATE_API_BOARD_SUCCESS,
    board,
    boardId
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
      .then(res => {
        dispatch(createApiBoardSuccess(res, boardId));
      })
      .catch(err => {
        dispatch(createApiBoardFailure(err.message));
      });
  };
}

export function updateApiBoard(boardData, boardId) {
  return (dispatch) => {
    dispatch(updateApiBoardStarted());
    boardData = {
      ...boardData,
      isPublic: false
    };
    return API.updateBoard(boardData)
      .then(res => {
        dispatch(updateApiBoardSuccess(res, boardId));
      })
      .catch(err => {
        dispatch(updateApiBoardFailure(err.message));
      });
  };
}

export function createApiBoardAndUpdateParent(boardData, boardId, parentBoard) {
  return (dispatch, getState) => {
    return dispatch(createApiBoard(boardData, boardId)).then(() => {
      var updatedBoard = getState().board.boards.find(board => board.id === parentBoard.id);
      updatedBoard.tiles[updatedBoard.tiles.length - 1].loadBoard = getState().board.boards[getState().board.boards.length-1].id;
      return dispatch(updateApiBoard(updatedBoard));
      });
  };
}
