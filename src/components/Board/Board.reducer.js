import defaultBoards from '../../api/boards.json';

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
  UPDATE_API_BOARD_STARTED
} from './Board.constants';
import { LOGOUT, LOGIN_SUCCESS } from '../Account/Login/Login.constants';

const [...boards] = defaultBoards.advanced;
const initialState = {
  boards,
  output: [],
  activeBoardId: null,
  navHistory: [],
  isFetching: false
};

function tileReducer(board, action) {
  switch (action.type) {
    case CREATE_TILE:
      return {
        ...board,
        tiles: [...board.tiles, { ...action.tile }]
      };
    case DELETE_TILES:
      return {
        ...board,
        tiles: board.tiles.filter(tile => action.tiles.indexOf(tile.id) === -1)
      };
    case EDIT_TILES:
      return {
        ...board,
        tiles: board.tiles.map(
          tile => action.tiles.find(s => s.id === tile.id) || tile
        )
      };
    default:
      return board;
  }
}

function boardReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      let activeBoardId = state.activeBoardId;
      const userCommunicators = action.payload.communicators || [];
      const activeCommunicator = userCommunicators.length
        ? userCommunicators[userCommunicators.length - 1]
        : null;

      if (activeCommunicator) {
        activeBoardId =
          activeCommunicator.rootBoard || initialState.activeBoardId;
      }

      return {
        ...state,
        activeBoardId
      };

    case LOGOUT:
      return initialState;

    case IMPORT_BOARDS:
      return {
        ...state,
        boards: action.boards
      };
    case ADD_BOARDS:
      return {
        ...state,
        boards: state.boards.concat(action.boards)
      };
    case CHANGE_BOARD:
      return {
        ...state,
        navHistory: Array.from(new Set([...state.navHistory, action.boardId])),
        activeBoardId: action.boardId
      };

    case REPLACE_BOARD:
      const nH = [...state.navHistory];
      const { prev, current } = action.payload;
      let boards = [...state.boards];

      if (prev.id !== current.id) {
        boards = boards.concat(current);
        const boardIndex = nH.findIndex(bId => bId === prev.id);
        if (boardIndex >= 0) {
          nH[boardIndex] = current.id;
        }
      } else {
        const boardIndex = boards.findIndex(b => b.id === current.id);
        if (boardIndex >= 0) {
          boards[boardIndex] = current;
        }
      }

      return {
        ...state,
        boards,
        navHistory: nH,
        activeBoardId:
          state.activeBoardId === prev.id ? current.id : state.activeBoardId
      };

    case SWITCH_BOARD:
      return {
        ...state,
        navHistory: [action.boardId],
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
    case CREATE_BOARD:
      return {
        ...state,
        boards: [
          ...state.boards,
          {
            id: action.boardId,
            name: action.boardName,
            nameKey: action.boardNameKey,
            tiles: []
          }
        ]
      };
    case CREATE_TILE:
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id !== action.boardId ? board : tileReducer(board, action)
        )
      };
    case DELETE_TILES:
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id !== action.boardId ? board : tileReducer(board, action)
        )
      };
    case EDIT_TILES:
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id !== action.boardId ? board : tileReducer(board, action)
        )
      };
    case FOCUS_TILE:
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id !== action.boardId
            ? board
            : { ...board, focusedTileId: action.tileId }
        )
      };
    case CHANGE_OUTPUT:
      return {
        ...state,
        output: [...action.output]
      };
    case CREATE_API_BOARD_SUCCESS:
      return {
        ...state,
        isFetching: false,
        boards: state.boards.map(board =>
          board.id === action.boardId
            ? { ...board, id: action.board.id } : board 
        )
      };
    case CREATE_API_BOARD_FAILURE:
      return {
        ...state,
        isFetching: false
      };
    case CREATE_API_BOARD_STARTED:
      return {
        ...state,
        isFetching: true
      };
    case UPDATE_API_BOARD_SUCCESS:
      return {
        ...state,
        isFetching: false,
        boards: state.boards.map(board =>
          board.id === action.boardId
            ? { ...board, id: action.board.id } : board
        )
      };
    case UPDATE_API_BOARD_FAILURE:
      return {
        ...state,
        isFetching: false
      };
    case UPDATE_API_BOARD_STARTED:
      return {
        ...state,
        isFetching: true
      };
    default:
      return state;
  }
}

export default boardReducer;
