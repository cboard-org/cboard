import defaultBoards from '../../api/boards.json';
import undoable, { distinctState } from 'redux-undo';
import storage from 'redux-persist/lib/storage';

import {
  IMPORT_BOARDS,
  CHANGE_BOARD,
  PREVIOUS_BOARD,
  ADD_BOARD,
  ADD_BOARD_BUTTON,
  DELETE_BOARD_BUTTONS,
  EDIT_BOARD_BUTTONS,
  FOCUS_BOARD_BUTTON,
  CHANGE_OUTPUT
} from './Board.constants';
import { persistReducer } from 'redux-persist';

const [...boards] = defaultBoards.advanced;
const rootBoardId = 'root';
const initialState = {
  boards,
  output: [],
  activeBoardId: rootBoardId,
  navHistory: [rootBoardId]
};

function buttonReducer(board, action) {
  switch (action.type) {
    case ADD_BOARD_BUTTON:
      return {
        ...board,
        buttons: [...board.buttons, { ...action.button }]
      };
    case DELETE_BOARD_BUTTONS:
      return {
        ...board,
        buttons: board.buttons.filter(
          button => action.buttons.indexOf(button.id) === -1
        )
      };
    case EDIT_BOARD_BUTTONS:
      return {
        ...board,
        buttons: board.buttons.map(
          button => action.buttons.find(s => s.id === button.id) || button
        )
      };
    default:
      return board;
  }
}

function boardReducer(state = initialState, action) {
  switch (action.type) {
    case IMPORT_BOARDS:
      return {
        ...state,
        boards: action.boards
      };
    case CHANGE_BOARD:
      return {
        ...state,
        navHistory: [...state.navHistory, action.boardId],
        activeBoardId: action.boardId
      };
    case PREVIOUS_BOARD:
      const [...navHistory] = state.navHistory;
      if (navHistory.length === 1) {
        return state;
      }
      navHistory.pop();
      return {
        ...state,
        navHistory,
        activeBoardId: navHistory[navHistory.length - 1]
      };
    case ADD_BOARD:
      return {
        ...state,
        boards: [
          ...state.boards,
          {
            id: action.boardId,
            name: action.boardName,
            nameKey: action.boardNameKey,
            buttons: []
          }
        ]
      };
    case ADD_BOARD_BUTTON:
      return {
        ...state,
        boards: state.boards.map(
          board =>
            board.id !== action.boardId ? board : buttonReducer(board, action)
        )
      };
    case DELETE_BOARD_BUTTONS:
      return {
        ...state,
        boards: state.boards.map(
          board =>
            board.id !== action.boardId ? board : buttonReducer(board, action)
        )
      };
    case EDIT_BOARD_BUTTONS:
      return {
        ...state,
        boards: state.boards.map(
          board =>
            board.id !== action.boardId ? board : buttonReducer(board, action)
        )
      };
    case FOCUS_BOARD_BUTTON:
      return {
        ...state,
        boards: state.boards.map(
          board =>
            board.id !== action.boardId
              ? board
              : { ...board, focusedBoardButtonId: action.buttonId }
        )
      };
    case CHANGE_OUTPUT:
      return {
        ...state,
        output: [...action.output]
      };
    default:
      return state;
  }
}

const undoSupportedBoardReducer = undoable(boardReducer, {
  filter: distinctState()
});

const config = {
  key: 'board',
  whitelist: ['present'],
  storage
};

export default persistReducer(config, undoSupportedBoardReducer);
