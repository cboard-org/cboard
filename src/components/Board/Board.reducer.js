import moment from 'moment';

import { DEFAULT_BOARDS, deepCopy } from '../../helpers';

import {
  IMPORT_BOARDS,
  ADD_BOARDS,
  CHANGE_BOARD,
  SWITCH_BOARD,
  PREVIOUS_BOARD,
  TO_ROOT_BOARD,
  CREATE_BOARD,
  UPDATE_BOARD,
  DELETE_BOARD,
  CREATE_TILE,
  DELETE_TILES,
  EDIT_TILES,
  FOCUS_TILE,
  CHANGE_OUTPUT,
  CHANGE_IMPROVED_PHRASE,
  REPLACE_BOARD,
  HISTORY_REMOVE_BOARD,
  UNMARK_BOARD,
  CHANGE_LIVE_MODE,
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
  GET_API_MY_BOARDS_STARTED,
  DOWNLOAD_IMAGES_STARTED,
  DOWNLOAD_IMAGE_SUCCESS,
  DOWNLOAD_IMAGE_FAILURE,
  UNMARK_SHOULD_CREATE_API_BOARD,
  SHORT_ID_MAX_LENGTH,
  SYNC_BOARDS_STARTED,
  SYNC_BOARDS_SUCCESS,
  SYNC_BOARDS_FAILURE,
  SYNC_STATUS
} from './Board.constants';
import { LOGOUT, LOGIN_SUCCESS } from '../Account/Login/Login.constants';

const initialBoardsState = [
  ...DEFAULT_BOARDS.advanced,
  ...DEFAULT_BOARDS.picSeePal
];

const initialState = {
  boards: deepCopy(initialBoardsState),
  output: [],
  activeBoardId: null,
  navHistory: [],
  isFetching: false,
  images: [],
  isFixed: false,
  isLiveMode: false,
  improvedPhrase: '',
  isSyncing: false,
  syncError: null
};

function resolveLastEdited(oldBoard, newBoard) {
  const oldDate = oldBoard?.lastEdited ? moment(oldBoard.lastEdited) : null;
  const newDate = newBoard?.lastEdited ? moment(newBoard.lastEdited) : null;

  if (newDate && (!oldDate || oldDate.isSameOrBefore(newDate))) {
    return newDate.format();
  }
  return moment().format();
}

function tileReducer(board, action) {
  switch (action.type) {
    case CREATE_TILE:
      return {
        ...board,
        tiles: [...board.tiles, { ...action.tile }],
        /* some times when a tile folder is created here the last tile change loadBoard to a long Id with no reason
      action tile before this copy has a short ID*/
        syncStatus: SYNC_STATUS.PENDING
      };
    case DELETE_TILES:
      return {
        ...board,
        tiles: board.tiles.filter(tile => action.tiles.indexOf(tile.id) === -1),
        syncStatus: SYNC_STATUS.PENDING
      };
    case EDIT_TILES:
      return {
        ...board,
        tiles: board.tiles.map(
          tile => action.tiles.find(s => s.id === tile.id) || tile
        ),
        syncStatus: SYNC_STATUS.PENDING
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
        navHistory: activeBoardId ? [activeBoardId] : []
      };

    case LOGOUT:
      return { ...initialState, boards: deepCopy(initialBoardsState) };

    case IMPORT_BOARDS:
      return {
        ...state,
        boards: action.boards
      };
    case ADD_BOARDS:
      return {
        ...state,
        boards: state.boards.concat(
          action.boards
            .filter(
              b => b != null && b.id && !state.boards.find(sb => sb.id === b.id)
            )
            .map(b => ({
              ...b,
              syncStatus: b.syncStatus || SYNC_STATUS.SYNCED
            }))
        )
      };
    case CHANGE_BOARD:
      const taBoards = [...state.boards];
      const taBoard = taBoards.find(item => item.id === action.boardId);
      if (!taBoard) {
        return { ...state };
      }
      const fixed = taBoard.isFixed || false;
      return {
        ...state,
        navHistory: Array.from(new Set([...state.navHistory, action.boardId])),
        activeBoardId: action.boardId,
        isFixed: fixed
      };
    case UPDATE_BOARD:
      const updateBoards = [...state.boards];
      const oldBoard = updateBoards.find(
        item => item.id === action.boardData.id
      );
      const index = updateBoards.indexOf(oldBoard);
      if (index !== -1) {
        const nextBoard = {
          ...action.boardData,
          lastEdited: resolveLastEdited(oldBoard, action.boardData),
          syncStatus: action.fromRemote
            ? SYNC_STATUS.SYNCED
            : SYNC_STATUS.PENDING
        };
        updateBoards.splice(index, 1, nextBoard);
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
        const boardIndex = boards.findIndex(b => b.id === prev.id);
        /* On create a parent board the prev board doesn't exist with a short Id
        because is already replaced by a long one */
        if (boardIndex >= 0) {
          boards[boardIndex] = current;
        }
        const nhIndex = nH.findIndex(bId => bId === prev.id);
        if (nhIndex >= 0) {
          nH[nhIndex] = current.id;
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
    case TO_ROOT_BOARD:
      const [...navigationHistory] = state.navHistory;
      if (navigationHistory.length <= 1) {
        return state;
      }
      return {
        ...state,
        navHistory: [navigationHistory[0]],
        activeBoardId: navigationHistory[0]
      };
    case HISTORY_REMOVE_BOARD:
      const dnavHistory = [...state.navHistory];
      if (dnavHistory.length < 2) {
        return state;
      }
      for (var i = 0; i < dnavHistory.length; i++) {
        if (dnavHistory[i] === action.removedBoardId) {
          dnavHistory.splice(i, 1);
        }
      }
      return {
        ...state,
        navHistory: dnavHistory
      };
    case CREATE_BOARD:
      const nextBoards = [...state.boards];
      nextBoards.push({
        ...action.boardData,
        lastEdited: moment().format(),
        syncStatus: SYNC_STATUS.PENDING
      });
      return {
        ...state,
        boards: nextBoards
      };
    case DELETE_BOARD:
      const boardIdsToDelete = Array.isArray(action.boardId)
        ? action.boardId
        : [action.boardId];
      return {
        ...state,
        boards: state.boards.map(board =>
          boardIdsToDelete.includes(board.id)
            ? { ...board, isDeleted: true, syncStatus: SYNC_STATUS.PENDING }
            : board
        ),
        navHistory: state.navHistory.filter(
          id => !boardIdsToDelete.includes(id)
        )
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
    case UNMARK_SHOULD_CREATE_API_BOARD:
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id !== action.boardId
            ? board
            : { ...board, shouldCreateBoard: false }
        )
      };
    case CHANGE_OUTPUT:
      return {
        ...state,
        output: [...action.output]
      };
    case CHANGE_LIVE_MODE:
      return {
        ...state,
        isLiveMode: !state.isLiveMode
      };
    case CREATE_API_BOARD_SUCCESS:
      const creadBoards = [...state.boards];
      const tilesToUpdateIds = [];
      const boardsToMarkForCreation = [];
      for (let i = 0; i < creadBoards.length; i++) {
        let tiles = creadBoards[i].tiles;
        if (tiles) {
          for (let j = 0; j < tiles.length; j++) {
            if (tiles[j] != null && tiles[j].loadBoard === action.boardId) {
              creadBoards[i].tiles[j].loadBoard = action.board.id;
              if (
                creadBoards[i].id.length > 14 &&
                creadBoards[i].hasOwnProperty('email')
              ) {
                creadBoards[i].markToUpdate = true;
                const tileUpdatedId = creadBoards[i].tiles[j].id;
                tilesToUpdateIds.push(tileUpdatedId);
              }

              const shouldCreateBoard =
                creadBoards[i].id.length < SHORT_ID_MAX_LENGTH;
              if (shouldCreateBoard) {
                boardsToMarkForCreation.push(creadBoards[i]);
              }
            }
          }
        }
      }
      boardsToMarkForCreation.forEach(board => {
        //if the tile id is already in a api board, we don't need to create it
        const boardTileIds = board.tiles.map(tile => tile.id);
        const boardIsAlreadyCreatedOnDb = boardTileIds.some(tileId =>
          tilesToUpdateIds.includes(tileId)
        );
        if (!boardIsAlreadyCreatedOnDb) board.shouldCreateBoard = true;
      });
      return {
        ...state,
        isFetching: false,
        boards: creadBoards.map(board =>
          board.id === action.boardId
            ? {
                ...board,
                id: action.board.id,
                lastEdited: action.board.lastEdited,
                syncStatus: SYNC_STATUS.SYNCED
              }
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
        isFetching: false,
        boards: state.boards.map(board =>
          board.id === action.boardData.id
            ? {
                ...board,
                lastEdited: action.boardData.lastEdited,
                syncStatus: SYNC_STATUS.SYNCED
              }
            : board
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
    case GET_API_MY_BOARDS_SUCCESS:
      return {
        ...state,
        isFetching: false
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
    case DOWNLOAD_IMAGES_STARTED:
      if (!Array.isArray(state.images)) {
        return {
          ...state,
          images: []
        };
      }
      return state;
    case DOWNLOAD_IMAGE_SUCCESS:
      const imgs = [...state.images];
      imgs.push(action.element);
      return {
        ...state,
        images: imgs
      };
    case DOWNLOAD_IMAGE_FAILURE:
      return {
        ...state
      };
    case CHANGE_IMPROVED_PHRASE:
      return {
        ...state,
        improvedPhrase: action.improvedPhrase
      };
    case SYNC_BOARDS_STARTED:
      return {
        ...state,
        isSyncing: true,
        syncError: null
      };
    case SYNC_BOARDS_SUCCESS:
      return {
        ...state,
        isSyncing: false,
        syncError: null
      };
    case SYNC_BOARDS_FAILURE:
      return {
        ...state,
        isSyncing: false,
        syncError: action.error
      };
    default:
      return state;
  }
}

export default boardReducer;
