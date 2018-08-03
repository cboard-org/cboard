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
  TOGGLE_SELECT,
  SELECT_TILE,
  DESELECT_TILE,
  SELECT_ALL_TILES,
  DESELECT_ALL_TILES
} from './Board.constants';

const [...boards] = defaultBoards.advanced;
const initialState = {
  activeBoardId: null,
  boards,
  navHistory: [],
  output: [],
  selectedTileIds: [],
  tileSelectable: false
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
        boards: state.boards.map(
          board =>
            board.id !== action.boardId ? board : tileReducer(board, action)
        )
      };
    case DELETE_TILES:
      return {
        ...state,
        boards: state.boards.map(
          board =>
            board.id !== action.boardId ? board : tileReducer(board, action)
        )
      };
    case EDIT_TILES:
      return {
        ...state,
        boards: state.boards.map(
          board =>
            board.id !== action.boardId ? board : tileReducer(board, action)
        )
      };
    case FOCUS_TILE:
      return {
        ...state,
        boards: state.boards.map(
          board =>
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
    case TOGGLE_SELECT:
      return {
        ...state,
        tileSelectable: !state.tileSelectable
      };
    case SELECT_TILE:
      return {
        ...state,
        selectedTileIds: [...state.selectedTileIds, action.tileId]
      };
    case DESELECT_TILE:
      return {
        ...state,
        selectedTileIds: [
          ...state.selectedTileIds.filter(tileId => tileId !== action.tileId)
        ]
      };
    case SELECT_ALL_TILES:
      const activeBoard = state.boards.find(
        board => board.id === state.activeBoardId
      );

      return {
        ...state,
        selectedTileIds: activeBoard.tiles.map(tile => tile.id)
      };
    case DESELECT_ALL_TILES:
      return {
        ...state,
        selectedTileIds: []
      };
    default:
      return state;
  }
}

export default boardReducer;
