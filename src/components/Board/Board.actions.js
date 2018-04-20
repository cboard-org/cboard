import {
  LOCK_BOARD,
  UNLOCK_BOARD,
  IMPORT_BOARDS,
  CHANGE_BOARD,
  PREVIOUS_BOARD,
  CREATE_BOARD,
  SELECT_TILE,
  UNSELECT_TILE,
  CREATE_TILE,
  DELETE_TILES,
  EDIT_TILES,
  FOCUS_TILE,
  CHANGE_OUTPUT
} from './Board.constants';

export function selectTile(id) {
  return {
    type: SELECT_TILE,
    id
  };
}

export function unselectTile(id) {
  return {
    type: UNSELECT_TILE,
    id
  };
}

export function lockBoard() {
  return {
    type: LOCK_BOARD
  };
}

export function unlockBoard() {
  return {
    type: UNLOCK_BOARD
  };
}

export function importBoards(boards) {
  return {
    type: IMPORT_BOARDS,
    boards
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
