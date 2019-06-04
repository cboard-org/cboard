import defaultBoards from '../../api/boards.json';

import {
  IMPORT_BOARDS,
  ADD_BOARDS,
  CHANGE_BOARD,
  SWITCH_BOARD,
  PREVIOUS_BOARD,
  CREATE_BOARD,
  UPDATE_BOARD,
  DELETE_BOARD,
  CREATE_TILE,
  DELETE_TILES,
  EDIT_TILES,
  FOCUS_TILE,
  CHANGE_OUTPUT,
  REPLACE_BOARD,
  HISTORY_REMOVE_PREVIOUS_BOARD,
  UNMARK_BOARD,
  CREATE_API_BOARD_SUCCESS,
  CREATE_API_BOARD_FAILURE,
  CREATE_API_BOARD_STARTED,
  UPDATE_API_BOARD_SUCCESS,
  UPDATE_API_BOARD_FAILURE,
  UPDATE_API_BOARD_STARTED,
  DELETE_API_BOARD_SUCCESS,
  DELETE_API_BOARD_FAILURE,
  DELETE_API_BOARD_STARTED,
  GET_API_MY_BOARDS_SUCCESS,
  GET_API_MY_BOARDS_FAILURE,
  GET_API_MY_BOARDS_STARTED
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
  //fix to prevent for null board 
  state.boards = state.boards.filter(board => board !== null);
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
        activeBoardId,
        navHistory: [activeBoardId]
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
    case UPDATE_BOARD:
      const updateBoards = [...state.boards];
      const oldBoard = updateBoards.find(
        item => item.id === action.boardData.id
      );
      const index = updateBoards.indexOf(oldBoard);
      if (index !== -1) {
        updateBoards.splice(index, 1, action.boardData);
        return {
          ...state,
          boards: updateBoards
        };
      }
      return {
        ...state
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
    case HISTORY_REMOVE_PREVIOUS_BOARD:
      const rnavHistory = [ ...state.navHistory ];
      if (rnavHistory.length === 1) {
        return state;
      }
      rnavHistory.pop();
      return {
        ...state,
        navHistory: rnavHistory,
        activeBoardId: action.boardId
      };
    case CREATE_BOARD:
      const nextBoards = [...state.boards];
      nextBoards.push(action.boardData);
      return {
        ...state,
        boards: nextBoards
      };
    case DELETE_BOARD:
      return {
        ...state,
        boards: state.boards.filter(board => action.boardId.indexOf(board.id) === -1)
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
    case UNMARK_BOARD:
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id !== action.boardId
            ? board
            : { ...board, markToUpdate: false }
        )
      };
    case CHANGE_OUTPUT:
      return {
        ...state,
        output: [...action.output]
      };
    case CREATE_API_BOARD_SUCCESS:
      const creadBoards = [...state.boards];
      for (let i = 0; i < creadBoards.length; i++) {
        let tiles = creadBoards[i].tiles;
        for (let j = 0; j < tiles.length; j++) {
          if (tiles[j] != null &&
            tiles[j].loadBoard === action.boardId) {
            tiles[j].loadBoard = action.board.id;
            if (!creadBoards[i].isPublic &&
              creadBoards[i].id.length > 14 &&
              creadBoards[i].hasOwnProperty('email')) {
              creadBoards[i].markToUpdate = true;
            }
          }
        }
      }
      return {
        ...state,
        isFetching: false,
        boards: creadBoards.map(board =>
          board.id === action.boardId
            ? { ...board, id: action.board.id }
            : board
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
        isFetching: false
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
    case GET_API_MY_BOARDS_SUCCESS:
      let flag = false;
      const myBoards = [...state.boards];
      for (let i = 0; i < action.boards.data.length; i++) {
        for (let j = 0; j < myBoards.length; j++) {
          if (myBoards[j].id === action.boards.data[i].id) {
            myBoards[j].tiles = action.boards.data[i].tiles;
            flag = true;
            break;
          }
        }
        if (!flag) {
          myBoards.push(action.boards.data[i]);
        }
        flag = false;
      }
      return {
        ...state,
        isFetching: false,
        boards: myBoards
      };
    case GET_API_MY_BOARDS_FAILURE:
      return {
        ...state,
        isFetching: false
      };
    case GET_API_MY_BOARDS_STARTED:
      return {
        ...state,
        isFetching: true
      };
    case DELETE_API_BOARD_SUCCESS:
      return {
        ...state,
        isFetching: false,
        boards: state.boards.filter(board => board.id !== action.board.id)
      };
    case DELETE_API_BOARD_FAILURE:
      return {
        ...state,
        isFetching: false
      };
    case DELETE_API_BOARD_STARTED:
      return {
        ...state,
        isFetching: true
      };
    default:
      return state;
  }
}

export default boardReducer;
