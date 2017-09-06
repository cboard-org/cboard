import defaultBoards from '../../api/boards.json';

import {
  IMPORT_BOARDS,
  CHANGE_BOARD,
  PREVIOUS_BOARD,
  ADD_BOARD,
  ADD_SYMBOL,
  DELETE_SYMBOLS,
  EDIT_SYMBOLS
} from './constants';

const [...boards] = defaultBoards.advanced;
const rootBoardId = 'root';
const initialState = {
  boards,
  activeBoardId: rootBoardId,
  navHistory: [rootBoardId]
};

function symbolReducer(board, action) {
  switch (action.type) {
    case ADD_SYMBOL:
      return Object.assign({}, board, {
        symbols: [...board.symbols, Object.assign({}, action.symbol)]
      });
    case DELETE_SYMBOLS:
      return Object.assign({}, board, {
        symbols: board.symbols.filter(
          symbol => action.symbols.indexOf(symbol.id) === -1
        )
      });
    case EDIT_SYMBOLS:
      return Object.assign({}, board, {
        symbols: board.symbols.map(
          symbol => action.symbols.find(s => s.id === symbol.id) || symbol
        )
      });
    default:
      return board;
  }
}

function boardReducer(state = initialState, action) {
  switch (action.type) {
    case IMPORT_BOARDS:
      return Object.assign({}, state, {
        boards: action.boards
      });
    case CHANGE_BOARD:
      return Object.assign({}, state, {
        navHistory: [...state.navHistory, action.boardId],
        activeBoardId: action.boardId
      });
    case PREVIOUS_BOARD:
      const [...navHistory] = state.navHistory;
      if (navHistory.length === 1) {
        return state;
      }
      navHistory.pop();
      return Object.assign({}, state, {
        navHistory,
        activeBoardId: navHistory[navHistory.length - 1]
      });
    case ADD_BOARD:
      return Object.assign({}, state, {
        boards: [
          ...state.boards,
          {
            id: action.boardId,
            symbols: []
          }
        ]
      });
    case ADD_SYMBOL:
      return Object.assign({}, state, {
        boards: state.boards.map(
          board =>
            board.id !== action.boardId ? board : symbolReducer(board, action)
        )
      });
    case DELETE_SYMBOLS:
      return Object.assign({}, state, {
        boards: state.boards.map(
          board =>
            board.id !== action.boardId ? board : symbolReducer(board, action)
        )
      });
    case EDIT_SYMBOLS:
      return Object.assign({}, state, {
        boards: state.boards.map(
          board =>
            board.id !== action.boardId ? board : symbolReducer(board, action)
        )
      });
    default:
      return state;
  }
}

export default boardReducer;
