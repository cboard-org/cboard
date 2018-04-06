import {
  IMPORT_BOARDS,
  CHANGE_BOARD,
  PREVIOUS_BOARD,
  ADD_BOARD,
  ADD_BOARD_TILE,
  DELETE_BOARD_TILES,
  EDIT_BOARD_TILES,
  FOCUS_BOARD_TILE,
  CHANGE_OUTPUT
} from './Board.constants';

export function importBoards(boards) {
  return {
    type: IMPORT_BOARDS,
    boards
  };
}

export function addBoard(boardId, boardName, boardNameKey) {
  return {
    type: ADD_BOARD,
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

export function addBoardTile(tile, boardId) {
  return {
    type: ADD_BOARD_TILE,
    tile,
    boardId
  };
}

export function deleteBoardTiles(tiles, boardId) {
  return {
    type: DELETE_BOARD_TILES,
    tiles,
    boardId
  };
}

export function editBoardTiles(tiles, boardId) {
  return {
    type: EDIT_BOARD_TILES,
    tiles,
    boardId
  };
}

export function focusBoardTile(tileId, boardId) {
  return {
    type: FOCUS_BOARD_TILE,
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
