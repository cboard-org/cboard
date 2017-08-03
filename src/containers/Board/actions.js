import {
  CHANGE_BOARD,
  PREVIOUS_BOARD,
  ADD_SYMBOL,
  DELETE_SYMBOLS
} from './constants';

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
  }
}
