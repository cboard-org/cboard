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
  CREATE_API_BOARD
} from './Board.constants';

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

export function createApiBoard(boardId, boardName, boardNameKey) {
  return {
    type: CREATE_API_BOARD,
    boardId,
    boardName,
    boardNameKey
  };
}
