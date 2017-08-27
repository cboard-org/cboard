import {
  IMPORT_BOARDS,
  CHANGE_BOARD,
  PREVIOUS_BOARD,
  ADD_BOARD,
  ADD_SYMBOL,
  DELETE_SYMBOLS,
  EDIT_SYMBOLS
} from './constants';

export function importBoards(boards) {
  return {
    type: IMPORT_BOARDS,
    boards
  };
}

export function addBoard(boardId) {
  return {
    type: ADD_BOARD,
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

export function addSymbol(symbol, boardId) {
  return {
    type: ADD_SYMBOL,
    symbol,
    boardId
  };
}

export function deleteSymbols(symbols, boardId) {
  return {
    type: DELETE_SYMBOLS,
    symbols,
    boardId
  };
}

export function editSymbols(symbols, boardId) {
  return {
    type: EDIT_SYMBOLS,
    symbols,
    boardId
  };
}
