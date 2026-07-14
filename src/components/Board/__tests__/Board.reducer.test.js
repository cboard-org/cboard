import boardReducer from '../Board.reducer';
import { DEFAULT_BOARDS } from '../../../helpers';
import {
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
  SYNC_STARTED,
  SYNC_FINISHED,
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
  isSaving: false,
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
    // A standalone local board (short id) gets its first server id. No tile of
    // it points at the board being promoted, so no loadBoard rewrite happens —
    // the parent/child rewrite is covered by the dedicated tests below.
    const serverBoardId = 'server-board-id-123456';
    const createApiBoardSuccess = {
      type: CREATE_API_BOARD_SUCCESS,
      board: { ...mockBoard, id: serverBoardId },
      boardId: mockBoard.id
    };
    expect(
      boardReducer(
        { ...initialState, boards: [...initialState.boards, mockBoard] },
        createApiBoardSuccess
      )
    ).toEqual({
      ...initialState,
      boards: [
        ...initialState.boards,
        { ...mockBoard, id: serverBoardId, lastEdited: mockBoard.lastEdited }
      ],
      syncMeta: {
        [serverBoardId]: { status: SYNC_STATUS.SYNCED }
      },
      isFetching: false
    });
  });
  it('should not write a ghost syncMeta entry on createApiBoardSuccess when the board was deleted before the response', () => {
    const createApiBoardSuccess = {
      type: CREATE_API_BOARD_SUCCESS,
      board: { ...mockBoard, id: 'server-board-id-123456' },
      boardId: '123'
    };
    // The local board ('123') is not in state — it was deleted between the API
    // call and this success response, so no syncMeta entry should be created.
    const result = boardReducer(initialState, createApiBoardSuccess);
    expect(result.syncMeta).toEqual({});
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
    expect(
      boardReducer(
        { ...initialState, boards: [...initialState.boards, mockBoard] },
        updateApiBoardSuccess
      )
    ).toEqual({
      ...initialState,
      boards: [...initialState.boards, mockBoard],
      syncMeta: { [mockBoard.id]: { status: SYNC_STATUS.SYNCED } },
      isFetching: false
    });
  });

  it('should not write a ghost syncMeta entry on updateApiBoardSuccess when the board is no longer in state', () => {
    const updateApiBoardSuccess = {
      type: UPDATE_API_BOARD_SUCCESS,
      boardData: mockBoard
    };
    expect(boardReducer(initialState, updateApiBoardSuccess)).toEqual({
      ...initialState,
      syncMeta: {},
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
    const result = boardReducer(
      {
        ...initialState,
        boards: [...initialState.boards, mockBoard]
      },
      editTiles
    );
    const editedBoard = result.boards.find(b => b.id === '123');
    expect(editedBoard.tiles).toEqual([{ id: '1234', loadBoard: '123' }]);
    expect(editedBoard.lastEdited).toBeDefined();
    expect(result.syncMeta['123']).toEqual({
      status: SYNC_STATUS.PENDING
    });
  });
  it('should handle createTile', () => {
    const createTile = {
      type: CREATE_TILE,
      tile: { id: '456' },
      boardId: '123'
    };
    const result = boardReducer(
      {
        ...initialState,
        boards: [...initialState.boards, mockBoard]
      },
      createTile
    );
    const updatedBoard = result.boards.find(b => b.id === '123');
    expect(updatedBoard.tiles).toEqual([
      { id: '1234', loadBoard: '456456456456456456456' },
      { id: '456' }
    ]);
    expect(updatedBoard.lastEdited).toBeDefined();
    expect(result.syncMeta['123']).toEqual({
      status: SYNC_STATUS.PENDING
    });
  });
  it('should handle deleteTiles', () => {
    const deleteTiles = {
      type: DELETE_TILES,
      tiles: ['1234'],
      boardId: '123'
    };
    const result = boardReducer(
      {
        ...initialState,
        boards: [...initialState.boards, mockBoard]
      },
      deleteTiles
    );
    const updatedBoard = result.boards.find(b => b.id === '123');
    expect(updatedBoard.tiles).toEqual([]);
    expect(updatedBoard.lastEdited).toBeDefined();
    expect(result.syncMeta['123']).toEqual({
      status: SYNC_STATUS.PENDING
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
  it('should handle addBoards setting syncMeta PENDING for local boards', () => {
    const addBoards = {
      type: ADD_BOARDS,
      boards: [mockBoard] // mockBoard.id is '123' (short = local)
    };
    const result = boardReducer(initialState, addBoards);
    expect(result.boards).toContainEqual(mockBoard);
    expect(result.syncMeta[mockBoard.id]).toEqual({
      status: SYNC_STATUS.PENDING
    });
  });
  it('should handle addBoards setting syncMeta SYNCED for server boards', () => {
    const serverBoard = { ...mockBoard, id: 'long-server-id-12345678' };
    const addBoards = {
      type: ADD_BOARDS,
      boards: [serverBoard]
    };
    const result = boardReducer(initialState, addBoards);
    expect(result.boards).toContainEqual(serverBoard);
    expect(result.syncMeta[serverBoard.id]).toEqual({
      status: SYNC_STATUS.SYNCED
    });
  });
  it('should handle addBoards preserving existing syncMeta fields', () => {
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
    const result = boardReducer(stateWithMeta, addBoards);
    expect(result.syncMeta[mockBoard.id].status).toBe(SYNC_STATUS.PENDING);
    expect(result.syncMeta[mockBoard.id].isDeleted).toBe(false);
  });
  it('should handle syncStarted', () => {
    const syncStarted = {
      type: SYNC_STARTED
    };
    expect(
      boardReducer({ ...initialState, syncError: null }, syncStarted)
    ).toEqual({
      ...initialState,
      isSyncing: true,
      syncError: null
    });
  });
  it('should handle syncFinished', () => {
    const syncFinished = {
      type: SYNC_FINISHED
    };
    expect(
      boardReducer({ ...initialState, isSyncing: true }, syncFinished)
    ).toEqual({
      ...initialState,
      isSyncing: false
    });
  });
  it('should handle syncBoardsStarted', () => {
    const syncBoardsStarted = {
      type: SYNC_BOARDS_STARTED
    };
    expect(
      boardReducer(
        { ...initialState, isSyncing: true, syncError: null },
        syncBoardsStarted
      )
    ).toEqual({
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
      isSyncing: true,
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
      isSyncing: true,
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
        status: SYNC_STATUS.PENDING
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
        status: SYNC_STATUS.SYNCED
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

    it('should set syncMeta PENDING for server board with markToUpdate on CREATE_API_BOARD_SUCCESS', () => {
      // A server board (id >= 14 chars, has email) whose tile references the local board being promoted
      const serverParentBoard = {
        id: 'server-board-id-1234',
        name: 'Server Parent',
        email: 'user@example.com',
        tiles: [{ id: 'tile-xyz', loadBoard: 'localChild' }]
      };
      const localChildBoard = {
        id: 'localChild',
        name: 'Local Child',
        tiles: []
      };
      const stateWithBoards = {
        ...initialState,
        boards: [...initialState.boards, serverParentBoard, localChildBoard]
      };
      const createApiBoardSuccess = {
        type: CREATE_API_BOARD_SUCCESS,
        board: { id: 'new-server-id-98765', lastEdited: '2024-01-01' },
        boardId: 'localChild'
      };
      const result = boardReducer(stateWithBoards, createApiBoardSuccess);
      const parent = result.boards.find(b => b.id === 'server-board-id-1234');
      // The parent's dangling short reference is rewritten to the new server id
      expect(parent.tiles[0].loadBoard).toBe('new-server-id-98765');
      // and the parent is flagged for re-push so the corrected reference lands
      expect(parent.markToUpdate).toBe(true);
      // Server parent board got markToUpdate: true → must be PENDING so next sync picks it up
      expect(result.syncMeta['server-board-id-1234']).toEqual({
        status: SYNC_STATUS.PENDING
      });
      // Newly created board stays SYNCED
      expect(result.syncMeta['new-server-id-98765']).toEqual({
        status: SYNC_STATUS.SYNCED
      });
    });

    it('should set syncMeta PENDING for local board with shouldCreateBoard on CREATE_API_BOARD_SUCCESS', () => {
      // A local board (id < 14 chars) whose tile references the local board being promoted
      const localParentBoard = {
        id: 'localParent',
        name: 'Local Parent',
        tiles: [{ id: 'tile-abc', loadBoard: 'localChild' }]
      };
      const localChildBoard = {
        id: 'localChild',
        name: 'Local Child',
        tiles: []
      };
      const stateWithBoards = {
        ...initialState,
        boards: [...initialState.boards, localParentBoard, localChildBoard]
      };
      const createApiBoardSuccess = {
        type: CREATE_API_BOARD_SUCCESS,
        board: { id: 'new-server-id-98765', lastEdited: '2024-01-01' },
        boardId: 'localChild'
      };
      const result = boardReducer(stateWithBoards, createApiBoardSuccess);
      const parent = result.boards.find(b => b.id === 'localParent');
      // The parent's short reference is rewritten to the new server id
      expect(parent.tiles[0].loadBoard).toBe('new-server-id-98765');
      // and the not-yet-created local parent is flagged for creation
      expect(parent.shouldCreateBoard).toBe(true);
      // Local parent board got shouldCreateBoard: true → must be PENDING so next sync creates it
      expect(result.syncMeta['localParent']).toEqual({
        status: SYNC_STATUS.PENDING
      });
      // Newly created board stays SYNCED
      expect(result.syncMeta['new-server-id-98765']).toEqual({
        status: SYNC_STATUS.SYNCED
      });
    });

    it('should not flag a local parent for creation on CREATE_API_BOARD_SUCCESS when its referencing tile already lives on a server board (alreadyOnDb)', () => {
      // The same referencing tile (by id) exists on both a server parent and a
      // local parent. Because it is already carried by the server board, the
      // local parent must not be marked for a redundant create.
      const localChildBoard = {
        id: 'localChild',
        name: 'Local Child',
        tiles: []
      };
      const serverParentBoard = {
        id: 'server-parent-id-1234',
        name: 'Server Parent',
        email: 'user@example.com',
        tiles: [{ id: 'shared-tile', loadBoard: 'localChild' }]
      };
      const localParentBoard = {
        id: 'localParent',
        name: 'Local Parent',
        tiles: [{ id: 'shared-tile', loadBoard: 'localChild' }]
      };
      const stateWithBoards = {
        ...initialState,
        boards: [
          ...initialState.boards,
          serverParentBoard,
          localParentBoard,
          localChildBoard
        ]
      };
      const createApiBoardSuccess = {
        type: CREATE_API_BOARD_SUCCESS,
        board: { id: 'new-server-id-98765', lastEdited: '2024-01-01' },
        boardId: 'localChild'
      };
      const result = boardReducer(stateWithBoards, createApiBoardSuccess);
      const localParent = result.boards.find(b => b.id === 'localParent');
      // Reference is handled by the server copy → no redundant create flag/meta
      expect(localParent.shouldCreateBoard).toBeUndefined();
      expect(result.syncMeta['localParent']).toBeUndefined();
      // The server parent is still rewritten and flagged for re-push
      const serverParent = result.boards.find(
        b => b.id === 'server-parent-id-1234'
      );
      expect(serverParent.tiles[0].loadBoard).toBe('new-server-id-98765');
      expect(serverParent.markToUpdate).toBe(true);
    });

    it('should keep the just-created board PENDING on CREATE_API_BOARD_SUCCESS while it still references a local child (issue #2218, create path)', () => {
      // The board being created (e.g. a transformed default parent) carries a
      // tile pointing at a grandchild that has NOT been created yet, so the copy
      // pushed to the server holds a dangling short id.
      const localGrandchild = {
        id: 'gchild', // short id (< 14) → still local / not on the server
        name: 'Grandchild',
        tiles: []
      };
      const parentBeingCreated = {
        id: 'shortParent',
        name: 'Parent',
        email: 'user@example.com',
        tiles: [{ id: 'tile-1', loadBoard: 'gchild' }]
      };
      const stateWithBoards = {
        ...initialState,
        boards: [...initialState.boards, parentBeingCreated, localGrandchild],
        syncMeta: { shortParent: { status: SYNC_STATUS.PENDING } }
      };
      const createApiBoardSuccess = {
        type: CREATE_API_BOARD_SUCCESS,
        board: { id: 'new-server-parent-id-11111', lastEdited: '2024-01-01' },
        boardId: 'shortParent'
      };
      const result = boardReducer(stateWithBoards, createApiBoardSuccess);
      // Must NOT graduate to SYNCED: the grandchild is still local, so the
      // reference just persisted on the server is dangling. Stay PENDING.
      expect(result.syncMeta['new-server-parent-id-11111']).toEqual({
        status: SYNC_STATUS.PENDING
      });
    });

    it('should keep board PENDING on UPDATE_API_BOARD_SUCCESS while it still references a local child (issue #2218)', () => {
      const localChild = { id: 'shortChild', name: 'Child', tiles: [] };
      const serverParent = {
        id: 'server-parent-id-12345',
        name: 'Parent',
        email: 'user@example.com',
        tiles: [{ id: 'tile-1', loadBoard: 'shortChild' }]
      };
      const stateWithBoards = {
        ...initialState,
        boards: [...initialState.boards, serverParent, localChild],
        syncMeta: { 'server-parent-id-12345': { status: SYNC_STATUS.PENDING } }
      };
      const updateApiBoardSuccess = {
        type: UPDATE_API_BOARD_SUCCESS,
        boardData: { ...serverParent, lastEdited: '2024-01-01' }
      };
      const result = boardReducer(stateWithBoards, updateApiBoardSuccess);
      // Must NOT graduate to SYNCED: the copy pushed to the server carries a
      // dangling short id, so it stays PENDING to retry on the next sync run.
      expect(result.syncMeta['server-parent-id-12345']).toEqual({
        status: SYNC_STATUS.PENDING
      });
    });

    it('should graduate to SYNCED on UPDATE_API_BOARD_SUCCESS when loadBoard points to a server child', () => {
      const serverChild = {
        id: 'server-child-id-67890',
        name: 'Child',
        tiles: []
      };
      const serverParent = {
        id: 'server-parent-id-12345',
        name: 'Parent',
        email: 'user@example.com',
        tiles: [{ id: 'tile-1', loadBoard: 'server-child-id-67890' }]
      };
      const stateWithBoards = {
        ...initialState,
        boards: [...initialState.boards, serverParent, serverChild],
        syncMeta: { 'server-parent-id-12345': { status: SYNC_STATUS.PENDING } }
      };
      const updateApiBoardSuccess = {
        type: UPDATE_API_BOARD_SUCCESS,
        boardData: { ...serverParent, lastEdited: '2024-01-01' }
      };
      const result = boardReducer(stateWithBoards, updateApiBoardSuccess);
      expect(result.syncMeta['server-parent-id-12345'].status).toBe(
        SYNC_STATUS.SYNCED
      );
    });

    it('should graduate to SYNCED on UPDATE_API_BOARD_SUCCESS when loadBoard points to a default board (never trapped in PENDING)', () => {
      // 'root' is a shipped default board (short id, support@cboard.io email)
      // that is intentionally never pushed, so a link to it is not a pending ref.
      const serverParent = {
        id: 'server-parent-id-12345',
        name: 'Parent',
        email: 'user@example.com',
        tiles: [{ id: 'tile-1', loadBoard: 'root' }]
      };
      const stateWithBoards = {
        ...initialState,
        boards: [...initialState.boards, serverParent],
        syncMeta: { 'server-parent-id-12345': { status: SYNC_STATUS.PENDING } }
      };
      const updateApiBoardSuccess = {
        type: UPDATE_API_BOARD_SUCCESS,
        boardData: { ...serverParent, lastEdited: '2024-01-01' }
      };
      const result = boardReducer(stateWithBoards, updateApiBoardSuccess);
      expect(result.syncMeta['server-parent-id-12345'].status).toBe(
        SYNC_STATUS.SYNCED
      );
    });

    it('should graduate the parent to SYNCED across the full resolution cycle: child gets its server id, then the parent update', () => {
      const localChild = { id: 'shortChild', name: 'Child', tiles: [] };
      const serverParent = {
        id: 'server-parent-id-12345',
        name: 'Parent',
        email: 'user@example.com',
        tiles: [{ id: 'tile-1', loadBoard: 'shortChild' }]
      };
      const initial = {
        ...initialState,
        boards: [...initialState.boards, serverParent, localChild],
        syncMeta: {
          'server-parent-id-12345': { status: SYNC_STATUS.PENDING },
          shortChild: { status: SYNC_STATUS.PENDING }
        }
      };

      // Step 1: the child is created on the server. Pass 2 rewrites the parent's
      // tile loadBoard to the child's new server id, and the parent must stay
      // PENDING so the next sync pushes the resolved reference.
      const createChild = {
        type: CREATE_API_BOARD_SUCCESS,
        board: { id: 'server-child-id-67890', lastEdited: '2024-01-01' },
        boardId: 'shortChild'
      };
      const afterChild = boardReducer(initial, createChild);

      expect(afterChild.syncMeta['server-child-id-67890'].status).toBe(
        SYNC_STATUS.SYNCED
      );
      expect(afterChild.syncMeta['server-parent-id-12345'].status).toBe(
        SYNC_STATUS.PENDING
      );
      const resolvedParent = afterChild.boards.find(
        b => b.id === 'server-parent-id-12345'
      );
      expect(resolvedParent.tiles[0].loadBoard).toBe('server-child-id-67890');

      // Step 2: the parent's own update lands. The reference is no longer
      // dangling, so it finally graduates to SYNCED.
      const updateParent = {
        type: UPDATE_API_BOARD_SUCCESS,
        boardData: { ...resolvedParent, lastEdited: '2024-01-02' }
      };
      const afterParent = boardReducer(afterChild, updateParent);

      expect(afterParent.syncMeta['server-parent-id-12345'].status).toBe(
        SYNC_STATUS.SYNCED
      );
    });
  });
});
