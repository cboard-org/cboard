import * as actions from '../Board.actions';
import * as types from '../Board.constants';
import boardReducer from '../Board.reducer';
import { DEFAULT_BOARDS } from '../../../helpers';
import {
  IMPORT_BOARDS,
  ADD_BOARDS,
  CHANGE_BOARD,
  SWITCH_BOARD,
  PREVIOUS_BOARD,
  DELETE_BOARD,
  TO_ROOT_BOARD,
  CREATE_BOARD,
  UPDATE_BOARD,
  CREATE_TILE,
  DELETE_TILES,
  EDIT_TILES,
  FOCUS_TILE,
  CHANGE_OUTPUT,
  REPLACE_BOARD,
  HISTORY_REMOVE_BOARD,
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
  GET_API_MY_BOARDS_STARTED,
  SYNC_BOARDS_STARTED,
  SYNC_BOARDS_SUCCESS,
  SYNC_BOARDS_FAILURE,
  SYNC_STATUS
} from '../Board.constants';
import { LOGOUT, LOGIN_SUCCESS } from '../../Account/Login/Login.constants';

const mockBoard = {
  name: 'tewt',
  id: '123',
  tiles: [{ id: '1234', loadBoard: '456456456456456456456' }],
  isPublic: false,
  email: 'asd@qwe.com',
  markToUpdate: true
};
const [...boards] = [...DEFAULT_BOARDS.advanced, ...DEFAULT_BOARDS.picSeePal];
const initialState = {
  boards,
  syncMeta: {},
  output: [],
  activeBoardId: null,
  navHistory: [],
  isFetching: false,
  isFixed: false,
  images: [],
  isLiveMode: false,
  improvedPhrase: '',
  isSyncing: false,
  syncError: null
};

describe('reducer', () => {
  it('should return the initial state', () => {
    expect(boardReducer(undefined, {})).toEqual(initialState);
  });
  it('should handle logout', () => {
    const logout = {
      type: LOGOUT
    };
    expect(boardReducer(initialState, logout)).toEqual(initialState);
  });
  it('should handle login ', () => {
    const login = {
      type: LOGIN_SUCCESS,
      payload: {}
    };
    expect(
      boardReducer(
        {
          ...initialState,
          navHistory: ['root']
        },
        login
      )
    ).toEqual({
      ...initialState,
      navHistory: []
    });
  });
  it('should handle createApiBoardStarted', () => {
    const createApiBoardStarted = {
      type: CREATE_API_BOARD_STARTED
    };
    expect(boardReducer(initialState, createApiBoardStarted)).toEqual({
      ...initialState,
      isFetching: true
    });
  });
  it('should handle deleteApiBoardStarted', () => {
    const deleteApiBoardStarted = {
      type: DELETE_API_BOARD_STARTED
    };
    expect(boardReducer(initialState, deleteApiBoardStarted)).toEqual({
      ...initialState,
      isFetching: true
    });
  });
  it('should handle getApiMyBoardsStarted', () => {
    const getApiMyBoardsStarted = {
      type: GET_API_MY_BOARDS_STARTED
    };
    expect(boardReducer(initialState, getApiMyBoardsStarted)).toEqual({
      ...initialState,
      isFetching: true
    });
  });
  it('should handle updateApiBoardStarted', () => {
    const updateApiBoardStarted = {
      type: UPDATE_API_BOARD_STARTED
    };
    expect(boardReducer(initialState, updateApiBoardStarted)).toEqual({
      ...initialState,
      isFetching: true
    });
  });
  it('should handle createApiBoardFailure', () => {
    const createApiBoardFailure = {
      type: CREATE_API_BOARD_FAILURE
    };
    expect(boardReducer(initialState, createApiBoardFailure)).toEqual({
      ...initialState,
      isFetching: false
    });
  });
  it('should handle deleteApiBoardFailure', () => {
    const deleteApiBoardFailure = {
      type: DELETE_API_BOARD_FAILURE
    };
    expect(boardReducer(initialState, deleteApiBoardFailure)).toEqual({
      ...initialState,
      isFetching: false
    });
  });
  it('should handle getApiMyBoardsFailure', () => {
    const getApiMyBoardsFailure = {
      type: GET_API_MY_BOARDS_FAILURE
    };
    expect(boardReducer(initialState, getApiMyBoardsFailure)).toEqual({
      ...initialState,
      isFetching: false
    });
  });
  it('should handle updateApiBoardFailure', () => {
    const updateApiBoardFailure = {
      type: UPDATE_API_BOARD_FAILURE
    };
    expect(boardReducer(initialState, updateApiBoardFailure)).toEqual({
      ...initialState,
      isFetching: false
    });
  });
  it('should handle createApiBoardSuccess', () => {
    const createApiBoardSuccess = {
      type: CREATE_API_BOARD_SUCCESS,
      board: mockBoard,
      boardId: '456456456456456456456'
    };
    expect(
      boardReducer(
        {
          ...initialState,
          boards: [
            ...initialState.boards,
            {
              ...mockBoard,
              id: '456456456456456456456'
            }
          ]
        },
        createApiBoardSuccess
      )
    ).toEqual({
      ...initialState,
      boards: [
        ...initialState.boards,
        {
          ...mockBoard,
          tiles: [{ id: '1234', loadBoard: '123' }],
          lastEdited: mockBoard.lastEdited
        }
      ],
      syncMeta: {
        [mockBoard.id]: { status: SYNC_STATUS.SYNCED, isDeleted: false }
      },
      isFetching: false
    });
  });
  it('should handle deleteApiBoardSuccess', () => {
    const deleteApiBoardSuccess = {
      type: DELETE_API_BOARD_SUCCESS,
      board: mockBoard
    };
    expect(boardReducer(initialState, deleteApiBoardSuccess)).toEqual({
      ...initialState,
      boards: [...initialState.boards.filter(board => board.id !== '123')],
      syncMeta: {},
      isFetching: false
    });
  });
  it('should handle getApiMyBoardsSuccess', () => {
    const getApiMyBoardsSuccess = {
      type: GET_API_MY_BOARDS_SUCCESS,
      boards: { data: [mockBoard, mockBoard] }
    };
    // GET_API_MY_BOARDS_SUCCESS now only updates isFetching
    // Board reconciliation is handled by syncBoards action
    expect(boardReducer(initialState, getApiMyBoardsSuccess)).toEqual({
      ...initialState,
      isFetching: false
    });
  });
  it('should handle updateApiBoardSuccess', () => {
    const updateApiBoardSuccess = {
      type: UPDATE_API_BOARD_SUCCESS,
      boardData: mockBoard
    };
    expect(boardReducer(initialState, updateApiBoardSuccess)).toEqual({
      ...initialState,
      syncMeta: { [mockBoard.id]: { status: SYNC_STATUS.SYNCED } },
      isFetching: false
    });
  });
  it('should handle unmarkBoard', () => {
    const unmarkBoard = {
      type: UNMARK_BOARD,
      boardId: '123'
    };
    expect(
      boardReducer(
        { ...initialState, boards: [...initialState.boards, mockBoard] },
        unmarkBoard
      )
    ).toEqual({
      ...initialState,
      boards: [
        ...initialState.boards.filter(board => board.id !== '123'),
        { ...mockBoard, markToUpdate: false }
      ]
    });
  });
  it('should handle historyRemoveBoard', () => {
    const historyRemoveBoard = {
      type: HISTORY_REMOVE_BOARD,
      removedBoardId: 'a'
    };
    expect(
      boardReducer(
        {
          ...initialState,
          navHistory: ['root', 'a', 'b']
        },
        historyRemoveBoard
      )
    ).toEqual({
      ...initialState,
      navHistory: ['root', 'b']
    });
  });
  it('should handle historyRemoveBoard 2', () => {
    const historyRemoveBoard = {
      type: HISTORY_REMOVE_BOARD,
      removedBoardId: 'root'
    };
    expect(
      boardReducer(
        {
          ...initialState,
          navHistory: ['root']
        },
        historyRemoveBoard
      )
    ).toEqual({
      ...initialState,
      navHistory: ['root']
    });
  });
  it('should handle replaceBoard', () => {
    const replaceBoard = {
      type: REPLACE_BOARD,
      payload: {
        prev: mockBoard,
        current: { ...mockBoard, id: '456' }
      }
    };
    expect(
      boardReducer(
        {
          ...initialState,
          boards: [...initialState.boards, mockBoard]
        },
        replaceBoard
      )
    ).toEqual({
      ...initialState,
      boards: [...initialState.boards, { ...mockBoard, id: '456' }]
    });
  });
  it('should handle replaceBoard 2', () => {
    const replaceBoard = {
      type: REPLACE_BOARD,
      payload: {
        prev: mockBoard,
        current: mockBoard
      }
    };
    expect(
      boardReducer(
        {
          ...initialState,
          boards: [...initialState.boards, mockBoard]
        },
        replaceBoard
      )
    ).toEqual({
      ...initialState,
      boards: [...initialState.boards, mockBoard]
    });
  });
  it('should handle changeOutput', () => {
    const changeOutput = {
      type: CHANGE_OUTPUT,
      output: 'done'
    };
    expect(boardReducer(initialState, changeOutput)).toEqual({
      ...initialState,
      output: ['d', 'o', 'n', 'e']
    });
  });
  it('should handle focusTile', () => {
    const focusTile = {
      type: FOCUS_TILE,
      tileId: '1234',
      boardId: '123'
    };
    expect(
      boardReducer(
        {
          ...initialState,
          boards: [...initialState.boards, mockBoard]
        },
        focusTile
      )
    ).toEqual({
      ...initialState,
      boards: [...initialState.boards, { ...mockBoard, focusedTileId: '1234' }]
    });
  });
  it('should handle editTiles', () => {
    const editTiles = {
      type: EDIT_TILES,
      tiles: [
        {
          id: '1234',
          loadBoard: '123'
        }
      ],
      boardId: '123'
    };
    expect(
      boardReducer(
        {
          ...initialState,
          boards: [...initialState.boards, mockBoard]
        },
        editTiles
      )
    ).toEqual({
      ...initialState,
      boards: [
        ...initialState.boards,
        { ...mockBoard, tiles: [{ id: '1234', loadBoard: '123' }] }
      ]
    });
  });
  it('should handle createTile', () => {
    const createTile = {
      type: CREATE_TILE,
      tile: { id: '456' },
      boardId: '123'
    };
    expect(
      boardReducer(
        {
          ...initialState,
          boards: [...initialState.boards, mockBoard]
        },
        createTile
      )
    ).toEqual({
      ...initialState,
      boards: [
        ...initialState.boards,
        {
          ...mockBoard,
          tiles: [
            {
              id: '1234',
              loadBoard: '456456456456456456456'
            },
            { id: '456' }
          ]
        }
      ]
    });
  });
  it('should handle deleteTiles', () => {
    const deleteTiles = {
      type: DELETE_TILES,
      tiles: ['1234'],
      boardId: '123'
    };
    expect(
      boardReducer(
        {
          ...initialState,
          boards: [...initialState.boards, mockBoard]
        },
        deleteTiles
      )
    ).toEqual({
      ...initialState,
      boards: [
        ...initialState.boards,
        {
          ...mockBoard,
          tiles: []
        }
      ]
    });
  });
  it('should handle deleteBoard (soft delete)', () => {
    const deleteBoard = {
      type: DELETE_BOARD,
      boardId: '123'
    };
    const result = boardReducer(
      {
        ...initialState,
        boards: [...initialState.boards, mockBoard],
        navHistory: ['123', '456']
      },
      deleteBoard
    );
    const deletedBoard = result.boards.find(b => b.id === '123');
    expect(deletedBoard).toEqual(mockBoard);
    expect(result.syncMeta['123']).toEqual({
      status: SYNC_STATUS.PENDING,
      isDeleted: true
    });
    expect(result.navHistory).toEqual(['456']);
  });
  it('should handle switchBoard', () => {
    const switchBoard = {
      type: SWITCH_BOARD,
      boardId: '123'
    };
    expect(
      boardReducer(
        {
          ...initialState,
          boards: [...initialState.boards, mockBoard]
        },
        switchBoard
      )
    ).toEqual({
      ...initialState,
      boards: [...initialState.boards, mockBoard],
      navHistory: ['123'],
      activeBoardId: '123'
    });
  });
  it('should handle changeBoard', () => {
    const changeBoard = {
      type: CHANGE_BOARD,
      boardId: '123'
    };
    expect(
      boardReducer(
        {
          ...initialState,
          boards: [...initialState.boards, mockBoard]
        },
        changeBoard
      )
    ).toEqual({
      ...initialState,
      boards: [...initialState.boards, mockBoard],
      navHistory: ['123'],
      activeBoardId: '123'
    });
  });
  it('should handle previousBoard', () => {
    const previousBoard = {
      type: PREVIOUS_BOARD
    };
    expect(
      boardReducer(
        {
          ...initialState,
          navHistory: ['123', '456'],
          activeBoardId: '456'
        },
        previousBoard
      )
    ).toEqual({
      ...initialState,
      navHistory: ['123'],
      activeBoardId: '123'
    });
  });
  it('should handle previousBoard 2', () => {
    const previousBoard = {
      type: PREVIOUS_BOARD
    };
    expect(
      boardReducer(
        {
          ...initialState,
          navHistory: ['123'],
          activeBoardId: '456'
        },
        previousBoard
      )
    ).toEqual({
      ...initialState,
      navHistory: ['123'],
      activeBoardId: '456'
    });
  });
  it('should handle toRootBoard', () => {
    const toRootBoard = {
      type: TO_ROOT_BOARD
    };
    expect(
      boardReducer(
        {
          ...initialState,
          navHistory: ['123', '456', '789'],
          activeBoardId: '789'
        },
        toRootBoard
      )
    ).toEqual({
      ...initialState,
      navHistory: ['123'],
      activeBoardId: '123'
    });
  });
  it('should handle addBoards setting syncMeta status to SYNCED', () => {
    const addBoards = {
      type: ADD_BOARDS,
      boards: [mockBoard]
    };
    const result = boardReducer(initialState, addBoards);
    expect(result.boards).toContainEqual(mockBoard);
    expect(result.syncMeta[mockBoard.id]).toEqual({
      status: SYNC_STATUS.SYNCED
    });
  });
  it('should handle addBoards always setting syncMeta status to SYNCED regardless of board data', () => {
    const addBoards = {
      type: ADD_BOARDS,
      boards: [{ ...mockBoard, syncStatus: SYNC_STATUS.PENDING }]
    };
    const result = boardReducer(initialState, addBoards);
    expect(result.syncMeta[mockBoard.id]).toEqual({
      status: SYNC_STATUS.SYNCED
    });
  });
  it('should handle addBoards preserving existing syncMeta fields when setting SYNCED', () => {
    const stateWithMeta = {
      ...initialState,
      syncMeta: {
        [mockBoard.id]: { status: SYNC_STATUS.PENDING, isDeleted: false }
      }
    };
    const addBoards = {
      type: ADD_BOARDS,
      boards: [mockBoard]
    };
    // Board is already in state.boards (via initialState.boards filtered check)
    // Since mockBoard.id is not in initialState.boards (default boards), it gets added
    const result = boardReducer(stateWithMeta, addBoards);
    expect(result.syncMeta[mockBoard.id].status).toBe(SYNC_STATUS.SYNCED);
  });
  it('should handle importdBoards', () => {
    const importdBoards = {
      type: IMPORT_BOARDS,
      boards: [mockBoard]
    };
    expect(boardReducer(initialState, importdBoards)).toEqual({
      ...initialState,
      boards: [mockBoard]
    });
  });
  it('should handle syncBoardsStarted', () => {
    const syncBoardsStarted = {
      type: SYNC_BOARDS_STARTED
    };
    expect(boardReducer(initialState, syncBoardsStarted)).toEqual({
      ...initialState,
      isSyncing: true,
      syncError: null
    });
  });
  it('should handle syncBoardsSuccess', () => {
    const syncBoardsSuccess = {
      type: SYNC_BOARDS_SUCCESS
    };
    expect(
      boardReducer({ ...initialState, isSyncing: true }, syncBoardsSuccess)
    ).toEqual({
      ...initialState,
      isSyncing: false,
      syncError: null
    });
  });
  it('should handle syncBoardsFailure', () => {
    const syncBoardsFailure = {
      type: SYNC_BOARDS_FAILURE,
      error: 'Network error'
    };
    expect(
      boardReducer({ ...initialState, isSyncing: true }, syncBoardsFailure)
    ).toEqual({
      ...initialState,
      isSyncing: false,
      syncError: 'Network error'
    });
  });

  describe('syncMeta tracking', () => {
    it('should set syncMeta PENDING on CREATE_BOARD', () => {
      const createBoard = {
        type: CREATE_BOARD,
        boardData: { id: 'new-board', name: 'New Board', tiles: [] }
      };
      const result = boardReducer(initialState, createBoard);
      expect(result.syncMeta['new-board']).toEqual({
        status: SYNC_STATUS.PENDING,
        isDeleted: false
      });
      const createdBoard = result.boards.find(b => b.id === 'new-board');
      expect(createdBoard.syncStatus).toBeUndefined();
    });

    it('should set syncMeta PENDING on UPDATE_BOARD when fromRemote is false', () => {
      const stateWithBoard = {
        ...initialState,
        boards: [...initialState.boards, mockBoard]
      };
      const updateBoard = {
        type: UPDATE_BOARD,
        boardData: { ...mockBoard, name: 'Updated Name' },
        fromRemote: false
      };
      const result = boardReducer(stateWithBoard, updateBoard);
      expect(result.syncMeta[mockBoard.id].status).toBe(SYNC_STATUS.PENDING);
      const updatedBoard = result.boards.find(b => b.id === mockBoard.id);
      expect(updatedBoard.syncStatus).toBeUndefined();
    });

    it('should set syncMeta SYNCED on UPDATE_BOARD when fromRemote is true', () => {
      const stateWithBoard = {
        ...initialState,
        boards: [...initialState.boards, mockBoard]
      };
      const updateBoard = {
        type: UPDATE_BOARD,
        boardData: { ...mockBoard, name: 'Remote Update' },
        fromRemote: true
      };
      const result = boardReducer(stateWithBoard, updateBoard);
      expect(result.syncMeta[mockBoard.id].status).toBe(SYNC_STATUS.SYNCED);
    });

    it('should set syncMeta SYNCED on CREATE_API_BOARD_SUCCESS', () => {
      const boardWithShortId = { ...mockBoard, id: 'short123' };
      const stateWithBoard = {
        ...initialState,
        boards: [...initialState.boards, boardWithShortId]
      };
      const createApiBoardSuccess = {
        type: CREATE_API_BOARD_SUCCESS,
        board: {
          ...mockBoard,
          id: 'long-api-id-12345678',
          lastEdited: '2024-01-01'
        },
        boardId: 'short123'
      };
      const result = boardReducer(stateWithBoard, createApiBoardSuccess);
      expect(result.syncMeta['long-api-id-12345678']).toEqual({
        status: SYNC_STATUS.SYNCED,
        isDeleted: false
      });
      expect(result.syncMeta['short123']).toBeUndefined();
      const syncedBoard = result.boards.find(
        b => b.id === 'long-api-id-12345678'
      );
      expect(syncedBoard.syncStatus).toBeUndefined();
    });

    it('should set syncMeta SYNCED on UPDATE_API_BOARD_SUCCESS', () => {
      const stateWithBoard = {
        ...initialState,
        boards: [...initialState.boards, mockBoard]
      };
      const updateApiBoardSuccess = {
        type: UPDATE_API_BOARD_SUCCESS,
        boardData: { ...mockBoard, lastEdited: '2024-01-01' }
      };
      const result = boardReducer(stateWithBoard, updateApiBoardSuccess);
      expect(result.syncMeta[mockBoard.id].status).toBe(SYNC_STATUS.SYNCED);
      const syncedBoard = result.boards.find(b => b.id === mockBoard.id);
      expect(syncedBoard.syncStatus).toBeUndefined();
    });

    it('should set syncMeta PENDING + isDeleted on DELETE_BOARD', () => {
      const stateWithBoard = {
        ...initialState,
        boards: [...initialState.boards, mockBoard]
      };
      const deleteBoard = { type: DELETE_BOARD, boardId: mockBoard.id };
      const result = boardReducer(stateWithBoard, deleteBoard);
      expect(result.syncMeta[mockBoard.id]).toEqual({
        status: SYNC_STATUS.PENDING,
        isDeleted: true
      });
      const board = result.boards.find(b => b.id === mockBoard.id);
      expect(board.isDeleted).toBeUndefined();
    });

    it('should set syncMeta PENDING + update lastEdited on MARK_BOARD_DIRTY', () => {
      const stateWithBoard = {
        ...initialState,
        boards: [...initialState.boards, mockBoard]
      };
      const markDirty = { type: types.MARK_BOARD_DIRTY, boardId: mockBoard.id };
      const result = boardReducer(stateWithBoard, markDirty);
      expect(result.syncMeta[mockBoard.id].status).toBe(SYNC_STATUS.PENDING);
      const dirtyBoard = result.boards.find(b => b.id === mockBoard.id);
      expect(dirtyBoard.lastEdited).toBeDefined();
      expect(dirtyBoard.syncStatus).toBeUndefined();
    });

    it('should remove syncMeta entry on DELETE_API_BOARD_SUCCESS', () => {
      const stateWithMeta = {
        ...initialState,
        boards: [...initialState.boards, mockBoard],
        syncMeta: {
          [mockBoard.id]: { status: SYNC_STATUS.PENDING, isDeleted: true }
        }
      };
      const deleteSuccess = {
        type: DELETE_API_BOARD_SUCCESS,
        board: mockBoard
      };
      const result = boardReducer(stateWithMeta, deleteSuccess);
      expect(result.syncMeta[mockBoard.id]).toBeUndefined();
    });

    it('should migrate syncMeta entry on REPLACE_BOARD', () => {
      const stateWithMeta = {
        ...initialState,
        boards: [...initialState.boards, mockBoard],
        syncMeta: { [mockBoard.id]: { status: SYNC_STATUS.PENDING } }
      };
      const replaceBoard = {
        type: REPLACE_BOARD,
        payload: {
          prev: mockBoard,
          current: { ...mockBoard, id: 'new-id-456' }
        }
      };
      const result = boardReducer(stateWithMeta, replaceBoard);
      expect(result.syncMeta['new-id-456']).toEqual({
        status: SYNC_STATUS.PENDING
      });
      expect(result.syncMeta[mockBoard.id]).toBeUndefined();
    });
  });
});
