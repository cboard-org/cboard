import * as actions from '../Board.actions';
import * as types from '../Board.constants';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import defaultBoards from '../../../api/boards.json';

jest.mock('../../../api/api');

const mockStore = configureMockStore([thunk]);

const mockBoard = {
  name: 'tewt',
  id: '12345678901234567',
  tiles: [{ id: '1234567890123456', loadBoard: '456456456456456456456' }],
  isPublic: false,
  email: 'asd@qwe.com',
  markToUpdate: true
};
const mockComm = {
  id: 'cboard_default',
  name: "Cboard's Communicator",
  description: "Cboard's default communicator",
  author: 'Cboard Team',
  email: 'support@cboard.io',
  rootBoard: '12345678901234567',
  boards: ['root', '12345678901234567']
};

const [...boards] = defaultBoards.advanced;
const initialState = {
  board: {
    boards: [mockBoard],
    syncMeta: {},
    output: [],
    activeBoardId: null,
    navHistory: [],
    isFetching: false
  },
  communicator: {
    activeCommunicatorId: mockComm.id,
    communicators: [mockComm]
  },
  app: {
    userData: {
      email: 'asd@qwe.com'
    },
    navigationSettings: {
      improvePhraseActive: false
    }
  }
};

describe('actions', () => {
  it('should create an action to REPLACE_ME', () => {
    const boards = {};
    const expectedAction = {
      type: types.IMPORT_BOARDS,
      boards
    };
    expect(actions.importBoards(boards)).toEqual(expectedAction);
  });

  it('should create an action to REPLACE_ME', () => {
    const boards = {};
    const expectedAction = {
      type: types.ADD_BOARDS,
      boards
    };
    expect(actions.addBoards(boards)).toEqual(expectedAction);
  });

  it('should create an action to REPLACE_ME', () => {
    const prev = {};
    const current = {};

    const expectedAction = {
      type: types.REPLACE_BOARD,
      payload: { prev, current }
    };

    expect(actions.replaceBoard(prev, current)).toEqual(expectedAction);
  });

  it('should create an action to REPLACE_ME', () => {
    const boardData = {};
    const expectedAction = {
      type: types.CREATE_BOARD,
      boardData
    };
    expect(actions.createBoard(boardData)).toEqual(expectedAction);
  });

  it('should create an action to UPDATE_BOARD with fromRemote default false', () => {
    const boardData = {};
    const expectedAction = {
      type: types.UPDATE_BOARD,
      boardData,
      fromRemote: false
    };
    expect(actions.updateBoard(boardData)).toEqual(expectedAction);
  });

  it('should create an action to UPDATE_BOARD with fromRemote true', () => {
    const boardData = {};
    const expectedAction = {
      type: types.UPDATE_BOARD,
      boardData,
      fromRemote: true
    };
    expect(actions.updateBoard(boardData, true)).toEqual(expectedAction);
  });

  it('should create an action to REPLACE_ME', () => {
    const boardId = '123';
    const expectedAction = {
      type: types.DELETE_BOARD,
      boardId
    };
    expect(actions.deleteBoard(boardId)).toEqual(expectedAction);
  });

  it('should create an action to REPLACE_ME', () => {
    const boardId = '123';
    const expectedAction = {
      type: types.SWITCH_BOARD,
      boardId
    };
    expect(actions.switchBoard(boardId)).toEqual(expectedAction);
  });

  it('should create an action to REPLACE_ME', () => {
    const boardId = '123';
    const expectedAction = {
      type: types.CHANGE_BOARD,
      boardId
    };
    expect(actions.changeBoard(boardId)).toEqual(expectedAction);
  });

  it('should create an action to REPLACE_ME', () => {
    const store = mockStore(() => initialState);
    const expectedAction = {
      type: types.PREVIOUS_BOARD
    };
    store.dispatch(actions.previousBoard());
    const dispatchedActions = store.getActions();
    expect(dispatchedActions).toEqual([expectedAction]);
  });

  it('should create an action to REPLACE_ME', () => {
    const store = mockStore(() => initialState);
    const expectedActions = [{ type: types.TO_ROOT_BOARD }];
    store.dispatch(actions.toRootBoard());
    const dispatchedActions = store.getActions();
    expect(dispatchedActions).toEqual(expectedActions);
  });

  it('should create an action to REPLACE_ME', () => {
    const boardId = '123';
    const expectedAction = {
      type: types.HISTORY_REMOVE_BOARD,
      removedBoardId: boardId
    };
    expect(actions.historyRemoveBoard(boardId)).toEqual(expectedAction);
  });

  it('should create an action to REPLACE_ME', () => {
    const boardId = '123';
    const expectedAction = {
      type: types.UNMARK_BOARD,
      boardId
    };
    expect(actions.unmarkBoard(boardId)).toEqual(expectedAction);
  });

  it('should create an action to REPLACE_ME', () => {
    const tile = {};
    const boardId = '123';
    const expectedAction = {
      type: types.CREATE_TILE,
      tile,
      boardId
    };
    expect(actions.createTile(tile, boardId)).toEqual(expectedAction);
  });

  it('should create an action to REPLACE_ME', () => {
    const tiles = [{}, {}];
    const boardId = '123';
    const expectedAction = {
      type: types.DELETE_TILES,
      tiles,
      boardId
    };
    expect(actions.deleteTiles(tiles, boardId)).toEqual(expectedAction);
  });

  it('should create an action to REPLACE_ME', () => {
    const tiles = [{}, {}];
    const boardId = '123';
    const expectedAction = {
      type: types.EDIT_TILES,
      tiles,
      boardId
    };
    expect(actions.editTiles(tiles, boardId)).toEqual(expectedAction);
  });

  it('should create an action to REPLACE_ME', () => {
    const tileId = '10';
    const boardId = '123';
    const expectedAction = {
      type: types.FOCUS_TILE,
      tileId,
      boardId
    };
    expect(actions.focusTile(tileId, boardId)).toEqual(expectedAction);
  });

  it('should create an action to REPLACE_ME', () => {
    const output = [{}, {}];
    const expectedActions = [
      {
        type: types.CHANGE_OUTPUT,
        output
      }
    ];

    const store = mockStore(initialState);
    store.dispatch(actions.changeOutput(output));
    const dispatchedActions = store.getActions();
    expect(dispatchedActions).toEqual(expectedActions);
  });

  it('should create an action to REPLACE_ME', () => {
    const boards = [{}];
    const expectedAction = {
      type: types.GET_API_MY_BOARDS_SUCCESS,
      boards
    };
    expect(actions.getApiMyBoardsSuccess(boards)).toEqual(expectedAction);
  });

  it('should create an action to REPLACE_ME', () => {
    const expectedAction = {
      type: types.GET_API_MY_BOARDS_STARTED
    };
    expect(actions.getApiMyBoardsStarted()).toEqual(expectedAction);
  });

  it('should create an action to REPLACE_ME', () => {
    const message = 'dummy message';
    const expectedAction = {
      type: types.GET_API_MY_BOARDS_FAILURE,
      message
    };
    expect(actions.getApiMyBoardsFailure(message)).toEqual(expectedAction);
  });

  it('should create an action to REPLACE_ME', () => {
    const board = {};
    const expectedAction = {
      type: types.CREATE_API_BOARD_SUCCESS,
      board
    };
    expect(actions.createApiBoardSuccess(board)).toEqual(expectedAction);
  });
  it('should create an action to UPDATE_API_BOARD_SUCCESS', () => {
    const board = { isLocalUpdateNeeded: false, name: 'test' };
    const store = mockStore(initialState);

    const expectedActions = [
      {
        type: types.UPDATE_API_BOARD_SUCCESS,
        boardData: { name: 'test' }
      }
    ];

    store.dispatch(actions.updateApiBoardSuccess(board));
    const dispatchedActions = store.getActions();
    expect(dispatchedActions).toEqual(expectedActions);
  });
  it('should dispatch UPDATE_BOARD and UPDATE_API_BOARD_SUCCESS when isLocalUpdateNeeded is true', () => {
    const board = { isLocalUpdateNeeded: true, name: 'test' };
    const store = mockStore(initialState);

    const expectedActions = [
      {
        type: types.UPDATE_BOARD,
        boardData: { name: 'test' }
      },
      {
        type: types.UPDATE_API_BOARD_SUCCESS,
        boardData: { name: 'test' }
      }
    ];

    store.dispatch(actions.updateApiBoardSuccess(board));
    const dispatchedActions = store.getActions();
    expect(dispatchedActions).toEqual(expectedActions);
  });
  it('should create an action to REPLACE_ME', () => {
    const expectedAction = {
      type: types.UPDATE_API_BOARD_STARTED
    };
    expect(actions.updateApiBoardStarted()).toEqual(expectedAction);
  });
  it('should create an action to REPLACE_ME', () => {
    const message = 'dummy message';
    const expectedAction = {
      type: types.UPDATE_API_BOARD_FAILURE,
      message
    };
    expect(actions.updateApiBoardFailure(message)).toEqual(expectedAction);
  });
  it('should create an action to REPLACE_ME', () => {
    const board = {};
    const expectedAction = {
      type: types.DELETE_API_BOARD_SUCCESS,
      board
    };
    expect(actions.deleteApiBoardSuccess(board)).toEqual(expectedAction);
  });
  it('should create an action to REPLACE_ME', () => {
    const expectedAction = {
      type: types.DELETE_API_BOARD_STARTED
    };
    expect(actions.deleteApiBoardStarted()).toEqual(expectedAction);
  });
  it('should create an action to REPLACE_ME', () => {
    const message = {};
    const expectedAction = {
      type: types.DELETE_API_BOARD_FAILURE,
      message
    };
    expect(actions.deleteApiBoardFailure(message)).toEqual(expectedAction);
  });
  it('check getApiObjects', () => {
    const store = mockStore(initialState);
    store.dispatch(actions.getApiObjects()).then(data => {
      expect(data).toEqual();
    });
  });
  it('check updateApiMarkedBoards', () => {
    const store = mockStore(initialState);
    store.dispatch(actions.updateApiMarkedBoards());
  });
  it('check getApiMyBoards', () => {
    const store = mockStore(initialState);
    store.dispatch(actions.getApiMyBoards());
  });
  it('check createApiBoard', () => {
    const store = mockStore(initialState);
    store
      .dispatch(actions.createApiBoard(mockBoard, '12345678901234567'))
      .then(data => {
        const actions = store.getActions();
        const dataResp = {
          board: mockBoard,
          boardId: '12345678901234567',
          type: 'cboard/Board/CREATE_API_BOARD_SUCCESS'
        };
        expect(actions[1]).toEqual(dataResp);
        expect(data).toEqual(mockBoard);
      })
      .catch(e => {
        throw new Error(e.message);
      });
  });
  it('check createApiBoard error', () => {
    const store = mockStore(initialState);
    store
      .dispatch(actions.createApiBoard({ error: 'error' }, '12345678901234567'))
      .then(() => {
        throw new Error('An error was expected');
      })
      .catch(e => {
        const actions = store.getActions();
        const dataResp = {
          message: '[object Object]',
          type: 'cboard/Board/CREATE_API_BOARD_FAILURE'
        };
        expect(actions[1]).toEqual(dataResp);
      });
  });
  it('check updateApiBoard', () => {
    const store = mockStore(initialState);
    store
      .dispatch(actions.updateApiBoard(mockBoard))
      .then(data => {
        expect(data).toEqual(mockBoard);
      })
      .catch(e => {
        throw new Error(e.message);
      });
  });
  it('check updateApiBoard error', () => {
    const store = mockStore(initialState);
    store
      .dispatch(actions.updateApiBoard({ error: 'error' }))
      .then(() => {
        throw new Error('An error was expected');
      })
      .catch(e => {
        const actions = store.getActions();
        const dataResp = {
          message: '[object Object]',
          type: 'cboard/Board/UPDATE_API_BOARD_FAILURE'
        };
        expect(actions[1]).toEqual(dataResp);
      });
  });
  it('check deleteApiBoard', () => {
    const store = mockStore(initialState);
    store
      .dispatch(actions.deleteApiBoard('12345678901234567'))
      .then(data => {
        expect(data).toEqual(mockBoard);
      })
      .catch(e => {
        throw new Error(e.message);
      });
  });
  it('check deleteApiBoard error', () => {
    const store = mockStore(initialState);
    store
      .dispatch(actions.deleteApiBoard('error'))
      .then(() => {
        throw new Error('An error was expected');
      })
      .catch(e => {
        const actions = store.getActions();
        const dataResp = {
          message: '[object Object]',
          type: 'cboard/Board/DELETE_API_BOARD_FAILURE'
        };
        expect(actions[1]).toEqual(dataResp);
      });
  });
  it('check updateApiObjectsNoChild', () => {
    const store = mockStore(initialState);
    store.dispatch(actions.updateApiObjectsNoChild(mockBoard)).then(data => {
      expect(data).toEqual('12345678901234567');
    });
  });
  it('check updateApiObjectsNoChild true / false', () => {
    const store = mockStore(initialState);
    store
      .dispatch(actions.updateApiObjectsNoChild(mockBoard, true))
      .then(data => {
        expect(data).toEqual('12345678901234567');
      });
  });
  it('check updateApiObjectsNoChild true / true', () => {
    const store = mockStore(initialState);
    store
      .dispatch(actions.updateApiObjectsNoChild(mockBoard, true, true))
      .then(data => {
        expect(data).toEqual('12345678901234567');
      });
  });
  it('check updateApiObjectsNoChild', () => {
    const store = mockStore(initialState);
    store
      .dispatch(actions.updateApiObjects(mockBoard, mockBoard))
      .then(data => {
        expect(data).toEqual('12345678901234567');
      });
  });
  it('check updateApiObjectsNoChild true / false', () => {
    const store = mockStore(initialState);
    store
      .dispatch(actions.updateApiObjects(mockBoard, mockBoard, true))
      .then(data => {
        expect(data).toEqual('12345678901234567');
      });
  });
  it('check updateApiObjectsNoChild true / true', () => {
    const store = mockStore(initialState);
    store
      .dispatch(actions.updateApiObjects(mockBoard, mockBoard, true, true))
      .then(data => {
        expect(data).toEqual('12345678901234567');
      });
  });
});

describe('syncBoardsStarted', () => {
  it('should create an action to SYNC_BOARDS_STARTED', () => {
    const expectedAction = {
      type: types.SYNC_BOARDS_STARTED
    };
    expect(actions.syncBoardsStarted()).toEqual(expectedAction);
  });
});

describe('syncBoardsSuccess', () => {
  it('should create an action to SYNC_BOARDS_SUCCESS', () => {
    const expectedAction = {
      type: types.SYNC_BOARDS_SUCCESS
    };
    expect(actions.syncBoardsSuccess()).toEqual(expectedAction);
  });
});

describe('syncBoardsFailure', () => {
  it('should create an action to SYNC_BOARDS_FAILURE with error message', () => {
    const error = new Error('Network error');
    const expectedAction = {
      type: types.SYNC_BOARDS_FAILURE,
      error: 'Network error'
    };
    expect(actions.syncBoardsFailure(error)).toEqual(expectedAction);
  });

  it('should create an action to SYNC_BOARDS_FAILURE with string error', () => {
    const error = 'Network error';
    const expectedAction = {
      type: types.SYNC_BOARDS_FAILURE,
      error: 'Network error'
    };
    expect(actions.syncBoardsFailure(error)).toEqual(expectedAction);
  });
});

describe('classifyRemoteBoards', () => {
  it('should classify new remote boards', () => {
    const localBoards = [{ id: '1', name: 'Local Board' }];
    const remoteBoards = [{ id: '2', name: 'Remote Board' }];
    const result = actions.classifyRemoteBoards(localBoards, remoteBoards);

    expect(result.boardsToAdd).toHaveLength(1);
    expect(result.boardsToAdd).toContainEqual({
      id: '2',
      name: 'Remote Board'
    });
    expect(result.boardsToUpdate).toHaveLength(0);
    expect(result.boardIdsToDelete).toHaveLength(0);
  });

  it('should classify remote-newer boards when remote has newer timestamp', () => {
    const localBoards = [
      { id: '1', name: 'Local', lastEdited: '2024-01-01T00:00:00Z' }
    ];
    const remoteBoards = [
      { id: '1', name: 'Remote', lastEdited: '2024-01-02T00:00:00Z' }
    ];
    const result = actions.classifyRemoteBoards(localBoards, remoteBoards);

    expect(result.boardsToAdd).toHaveLength(0);
    expect(result.boardsToUpdate).toHaveLength(1);
    expect(result.boardsToUpdate[0].name).toBe('Remote');
  });

  it('should not classify as remote-newer when local has newer timestamp', () => {
    const localBoards = [
      { id: '1', name: 'Local', lastEdited: '2024-01-02T00:00:00Z' }
    ];
    const remoteBoards = [
      { id: '1', name: 'Remote', lastEdited: '2024-01-01T00:00:00Z' }
    ];
    const result = actions.classifyRemoteBoards(localBoards, remoteBoards);

    expect(result.boardsToAdd).toHaveLength(0);
    expect(result.boardsToUpdate).toHaveLength(0);
  });

  it('should not classify as remote-newer when timestamps are equal', () => {
    const localBoards = [
      { id: '1', name: 'Local', lastEdited: '2024-01-01T00:00:00Z' }
    ];
    const remoteBoards = [
      { id: '1', name: 'Remote', lastEdited: '2024-01-01T00:00:00Z' }
    ];
    const result = actions.classifyRemoteBoards(localBoards, remoteBoards);

    expect(result.boardsToAdd).toHaveLength(0);
    expect(result.boardsToUpdate).toHaveLength(0);
  });

  it('should handle empty remote boards', () => {
    const localBoards = [{ id: '1', name: 'Local Board' }];
    const remoteBoards = [];
    const result = actions.classifyRemoteBoards(localBoards, remoteBoards);

    expect(result.boardsToAdd).toHaveLength(0);
    expect(result.boardsToUpdate).toHaveLength(0);
  });

  it('should handle empty local boards', () => {
    const localBoards = [];
    const remoteBoards = [{ id: '1', name: 'Remote Board' }];
    const result = actions.classifyRemoteBoards(localBoards, remoteBoards);

    expect(result.boardsToAdd).toHaveLength(1);
    expect(result.boardsToUpdate).toHaveLength(0);
  });

  it('should identify boards deleted on server (boardIdsToDelete)', () => {
    const localBoards = [{ id: '12345678901234567890', name: 'Server Board' }];
    const syncMeta = {
      '12345678901234567890': { status: types.SYNC_STATUS.SYNCED }
    };
    const remoteBoards = []; // board not in remote = deleted on server
    const result = actions.classifyRemoteBoards(
      localBoards,
      remoteBoards,
      syncMeta
    );

    expect(result.boardIdsToDelete).toHaveLength(1);
    expect(result.boardIdsToDelete).toContain('12345678901234567890');
  });

  it('should not classify short ID boards as deleted on server', () => {
    const localBoards = [
      { id: 'short123', name: 'Local Board' } // short ID = local only board
    ];
    const remoteBoards = [];
    const result = actions.classifyRemoteBoards(localBoards, remoteBoards);

    expect(result.boardIdsToDelete).toHaveLength(0);
  });

  it('should not classify untracked boards (no syncStatus) as deleted on server', () => {
    const localBoards = [
      { id: '12345678901234567890', name: 'Untracked Board' } // no syncStatus
    ];
    const remoteBoards = [];
    const result = actions.classifyRemoteBoards(localBoards, remoteBoards);

    expect(result.boardIdsToDelete).toHaveLength(0);
  });

  it('should not classify locally deleted boards as deleted on server', () => {
    const localBoards = [{ id: '12345678901234567890', name: 'Board' }];
    const syncMeta = {
      '12345678901234567890': {
        status: types.SYNC_STATUS.PENDING,
        isDeleted: true
      }
    };
    const remoteBoards = [];
    const result = actions.classifyRemoteBoards(
      localBoards,
      remoteBoards,
      syncMeta
    );

    expect(result.boardIdsToDelete).toHaveLength(0);
  });
});

describe('pushLocalChangesToApi', () => {
  it('should push boards with syncMeta status PENDING', async () => {
    const boardWithPendingSync = { ...mockBoard, id: '12345678901234567890' };
    const boardWithSyncedStatus = { ...mockBoard, id: '12345678901234567891' };
    const storeWithBoards = mockStore({
      ...initialState,
      board: {
        ...initialState.board,
        boards: [boardWithPendingSync, boardWithSyncedStatus],
        syncMeta: {
          '12345678901234567890': { status: types.SYNC_STATUS.PENDING },
          '12345678901234567891': { status: types.SYNC_STATUS.SYNCED }
        }
      }
    });

    await storeWithBoards.dispatch(actions.pushLocalChangesToApi());
    const actionTypes = storeWithBoards.getActions().map(a => a.type);

    // Should only dispatch for boardWithPendingSync
    expect(actionTypes).toContain(types.UPDATE_API_BOARD_STARTED);
  });

  it('should use updateApiObjectsNoChild for short ID boards', async () => {
    const localCreatedBoard = { ...mockBoard, id: 'short123' };
    const storeWithBoards = mockStore({
      ...initialState,
      board: {
        ...initialState.board,
        boards: [localCreatedBoard],
        syncMeta: { short123: { status: types.SYNC_STATUS.PENDING } }
      }
    });

    await storeWithBoards.dispatch(actions.pushLocalChangesToApi());
    const actionTypes = storeWithBoards.getActions().map(a => a.type);

    // Should dispatch CREATE_API_BOARD_STARTED for short ID boards
    expect(actionTypes).toContain(types.CREATE_API_BOARD_STARTED);
  });

  it('should not push any boards when none have syncMeta status PENDING', async () => {
    const boardWithSyncedStatus = { ...mockBoard };
    const storeWithBoards = mockStore({
      ...initialState,
      board: {
        ...initialState.board,
        boards: [boardWithSyncedStatus],
        syncMeta: { [mockBoard.id]: { status: types.SYNC_STATUS.SYNCED } }
      }
    });

    await storeWithBoards.dispatch(actions.pushLocalChangesToApi());
    const actionTypes = storeWithBoards.getActions().map(a => a.type);

    expect(actionTypes).not.toContain(types.UPDATE_API_BOARD_STARTED);
    expect(actionTypes).not.toContain(types.CREATE_API_BOARD_STARTED);
  });

  it('should not push boards marked as deleted in syncMeta, and delete them from server', async () => {
    const deletedBoard = { ...mockBoard, id: '12345678901234567890' };
    const storeWithBoards = mockStore({
      ...initialState,
      board: {
        ...initialState.board,
        boards: [deletedBoard],
        syncMeta: {
          '12345678901234567890': {
            status: types.SYNC_STATUS.PENDING,
            isDeleted: true
          }
        }
      }
    });

    await storeWithBoards.dispatch(actions.pushLocalChangesToApi());
    const actionTypes = storeWithBoards.getActions().map(a => a.type);

    // Should dispatch DELETE_API_BOARD_STARTED instead of UPDATE
    expect(actionTypes).toContain(types.DELETE_API_BOARD_STARTED);
    expect(actionTypes).not.toContain(types.UPDATE_API_BOARD_STARTED);
  });

  it('should hard delete local-only boards marked as deleted without API call', async () => {
    const deletedLocalBoard = { ...mockBoard, id: 'short123' };
    const storeWithBoards = mockStore({
      ...initialState,
      board: {
        ...initialState.board,
        boards: [deletedLocalBoard],
        syncMeta: {
          short123: { status: types.SYNC_STATUS.PENDING, isDeleted: true }
        }
      }
    });

    await storeWithBoards.dispatch(actions.pushLocalChangesToApi());
    const actionTypes = storeWithBoards.getActions().map(a => a.type);

    // Should dispatch DELETE_API_BOARD_SUCCESS directly (hard delete)
    expect(actionTypes).toContain(types.DELETE_API_BOARD_SUCCESS);
    expect(actionTypes).not.toContain(types.DELETE_API_BOARD_STARTED);
  });

  it('should push untracked board that is newer than remote version', async () => {
    const untrackedBoard = {
      ...mockBoard,
      id: '12345678901234567890',
      email: 'asd@qwe.com',
      lastEdited: '2025-06-01T00:00:00.000Z'
      // no syncStatus
    };
    const remoteBoards = [
      { id: '12345678901234567890', lastEdited: '2025-01-01T00:00:00.000Z' }
    ];
    const storeWithBoards = mockStore({
      ...initialState,
      board: { ...initialState.board, boards: [untrackedBoard] }
    });

    await storeWithBoards.dispatch(actions.pushLocalChangesToApi(remoteBoards));
    const actionTypes = storeWithBoards.getActions().map(a => a.type);

    expect(actionTypes).toContain(types.UPDATE_API_BOARD_STARTED);
  });

  it('should graduate untracked board to SYNCED when older than remote version', async () => {
    const untrackedBoard = {
      ...mockBoard,
      id: '12345678901234567890',
      email: 'asd@qwe.com',
      lastEdited: '2025-01-01T00:00:00.000Z'
      // no syncStatus
    };
    const remoteBoards = [
      { id: '12345678901234567890', lastEdited: '2025-06-01T00:00:00.000Z' }
    ];
    const storeWithBoards = mockStore({
      ...initialState,
      board: { ...initialState.board, boards: [untrackedBoard] }
    });

    await storeWithBoards.dispatch(actions.pushLocalChangesToApi(remoteBoards));
    const actionTypes = storeWithBoards.getActions().map(a => a.type);

    // Should not push to API
    expect(actionTypes).not.toContain(types.UPDATE_API_BOARD_STARTED);
    expect(actionTypes).not.toContain(types.CREATE_API_BOARD_STARTED);

    // Should graduate to SYNCED via updateBoard with fromRemote=true
    expect(actionTypes).toContain(types.UPDATE_BOARD);
    const updateAction = storeWithBoards
      .getActions()
      .find(a => a.type === types.UPDATE_BOARD);
    expect(updateAction.fromRemote).toBe(true);
  });

  it('should push untracked board that does not exist on server', async () => {
    const untrackedBoard = {
      ...mockBoard,
      id: 'short123', // short ID = local only
      email: 'asd@qwe.com'
      // no syncStatus
    };
    const remoteBoards = []; // not on server
    const storeWithBoards = mockStore({
      ...initialState,
      board: { ...initialState.board, boards: [untrackedBoard] }
    });

    await storeWithBoards.dispatch(actions.pushLocalChangesToApi(remoteBoards));
    const actionTypes = storeWithBoards.getActions().map(a => a.type);

    expect(actionTypes).toContain(types.CREATE_API_BOARD_STARTED);
  });

  it('should not push untracked board belonging to a different user', async () => {
    const untrackedBoard = {
      ...mockBoard,
      id: '12345678901234567890',
      email: 'other@user.com',
      lastEdited: '2025-06-01T00:00:00.000Z'
      // no syncStatus
    };
    const remoteBoards = [
      { id: '12345678901234567890', lastEdited: '2025-01-01T00:00:00.000Z' }
    ];
    const storeWithBoards = mockStore({
      ...initialState,
      board: { ...initialState.board, boards: [untrackedBoard] }
    });

    await storeWithBoards.dispatch(actions.pushLocalChangesToApi(remoteBoards));
    const actionTypes = storeWithBoards.getActions().map(a => a.type);

    expect(actionTypes).not.toContain(types.UPDATE_API_BOARD_STARTED);
    expect(actionTypes).not.toContain(types.CREATE_API_BOARD_STARTED);
  });

  it('should not delete boards without a syncMeta entry', async () => {
    const untrackedBoard = { ...mockBoard, id: '12345678901234567890' };
    const storeWithBoards = mockStore({
      ...initialState,
      board: { ...initialState.board, boards: [untrackedBoard], syncMeta: {} }
    });

    await storeWithBoards.dispatch(actions.pushLocalChangesToApi());
    const actionTypes = storeWithBoards.getActions().map(a => a.type);

    expect(actionTypes).not.toContain(types.DELETE_API_BOARD_STARTED);
    expect(actionTypes).not.toContain(types.DELETE_API_BOARD_SUCCESS);
  });

  it('should return early when no user email is available', async () => {
    const pendingBoard = { ...mockBoard, id: '12345678901234567890' };
    const storeWithBoards = mockStore({
      ...initialState,
      app: { ...initialState.app, userData: {} },
      board: {
        ...initialState.board,
        boards: [pendingBoard],
        syncMeta: {
          '12345678901234567890': { status: types.SYNC_STATUS.PENDING }
        }
      }
    });

    await storeWithBoards.dispatch(actions.pushLocalChangesToApi());
    const actionTypes = storeWithBoards.getActions().map(a => a.type);

    expect(actionTypes).not.toContain(types.UPDATE_API_BOARD_STARTED);
    expect(actionTypes).not.toContain(types.CREATE_API_BOARD_STARTED);
  });

  it('should not push PENDING boards owned by a different user', async () => {
    const otherUserBoard = {
      ...mockBoard,
      id: '12345678901234567890',
      email: 'other@user.com'
    };
    const storeWithBoards = mockStore({
      ...initialState,
      board: {
        ...initialState.board,
        boards: [otherUserBoard],
        syncMeta: {
          '12345678901234567890': { status: types.SYNC_STATUS.PENDING }
        }
      }
    });

    await storeWithBoards.dispatch(actions.pushLocalChangesToApi());
    const actionTypes = storeWithBoards.getActions().map(a => a.type);

    expect(actionTypes).not.toContain(types.UPDATE_API_BOARD_STARTED);
    expect(actionTypes).not.toContain(types.CREATE_API_BOARD_STARTED);
  });

  it('should not push PENDING default boards (support@cboard.io)', async () => {
    const defaultBoard = {
      ...mockBoard,
      id: '12345678901234567890',
      email: 'support@cboard.io'
    };
    const storeWithBoards = mockStore({
      ...initialState,
      board: {
        ...initialState.board,
        boards: [defaultBoard],
        syncMeta: {
          '12345678901234567890': { status: types.SYNC_STATUS.PENDING }
        }
      }
    });

    await storeWithBoards.dispatch(actions.pushLocalChangesToApi());
    const actionTypes = storeWithBoards.getActions().map(a => a.type);

    expect(actionTypes).not.toContain(types.UPDATE_API_BOARD_STARTED);
    expect(actionTypes).not.toContain(types.CREATE_API_BOARD_STARTED);
  });

  it('should not push PENDING boards with empty email (created while logged out)', async () => {
    const offlineBoard = {
      ...mockBoard,
      id: '12345678901234567890',
      email: ''
    };
    const storeWithBoards = mockStore({
      ...initialState,
      board: {
        ...initialState.board,
        boards: [offlineBoard],
        syncMeta: {
          '12345678901234567890': { status: types.SYNC_STATUS.PENDING }
        }
      }
    });

    await storeWithBoards.dispatch(actions.pushLocalChangesToApi());
    const actionTypes = storeWithBoards.getActions().map(a => a.type);

    expect(actionTypes).not.toContain(types.UPDATE_API_BOARD_STARTED);
    expect(actionTypes).not.toContain(types.CREATE_API_BOARD_STARTED);
  });
});

describe('applyRemoteChangesToState', () => {
  it('should dispatch addBoards for new remote boards', async () => {
    const store = mockStore(initialState);
    const boardsToAdd = [
      { id: 'new-board-1', name: 'New Board' },
      { id: 'new-board-2', name: 'Another New Board' }
    ];

    await store.dispatch(
      actions.applyRemoteChangesToState({
        boardsToAdd,
        boardsToUpdate: [],
        boardIdsToDelete: []
      })
    );
    const dispatchedActions = store.getActions();

    expect(dispatchedActions).toContainEqual({
      type: types.ADD_BOARDS,
      boards: boardsToAdd
    });
  });

  it('should dispatch updateBoard for each board to update', async () => {
    const store = mockStore(initialState);
    const boardsToUpdate = [
      { id: '1', name: 'Updated Board 1' },
      { id: '2', name: 'Updated Board 2' }
    ];

    await store.dispatch(
      actions.applyRemoteChangesToState({
        boardsToAdd: [],
        boardsToUpdate,
        boardIdsToDelete: []
      })
    );
    const dispatchedActions = store.getActions();
    const updateActions = dispatchedActions.filter(
      a => a.type === types.UPDATE_BOARD
    );

    expect(updateActions).toHaveLength(2);
  });

  it('should not dispatch addBoards when boardsToAdd is empty', async () => {
    const store = mockStore(initialState);

    await store.dispatch(
      actions.applyRemoteChangesToState({
        boardsToAdd: [],
        boardsToUpdate: [],
        boardIdsToDelete: []
      })
    );
    const actionTypes = store.getActions().map(a => a.type);

    expect(actionTypes).not.toContain(types.ADD_BOARDS);
  });

  it('should dispatch deleteApiBoardSuccess for boards confirmed deleted (404)', async () => {
    const API = require('../../../api/api').default;
    const boardId = '12345678901234567890';
    API.getBoard = jest.fn().mockRejectedValue({
      response: { status: 404 }
    });

    const store = mockStore(initialState);

    await store.dispatch(
      actions.applyRemoteChangesToState({
        boardsToAdd: [],
        boardsToUpdate: [],
        boardIdsToDelete: [boardId]
      })
    );
    const dispatchedActions = store.getActions();

    expect(dispatchedActions).toContainEqual({
      type: types.DELETE_API_BOARD_SUCCESS,
      board: { id: boardId }
    });
  });

  it('should dispatch updateBoard when board still exists on server', async () => {
    const API = require('../../../api/api').default;
    const boardId = '12345678901234567890';
    const serverBoard = { id: boardId, name: 'Server Board' };
    API.getBoard = jest.fn().mockResolvedValue(serverBoard);

    const store = mockStore(initialState);

    await store.dispatch(
      actions.applyRemoteChangesToState({
        boardsToAdd: [],
        boardsToUpdate: [],
        boardIdsToDelete: [boardId]
      })
    );
    const updateActions = store
      .getActions()
      .filter(a => a.type === types.UPDATE_BOARD);

    expect(updateActions).toHaveLength(1);
  });
});

describe('syncBoards', () => {
  it('should dispatch syncBoardsStarted and syncBoardsSuccess on success', async () => {
    const store = mockStore(initialState);
    const remoteBoards = [];

    await store.dispatch(actions.syncBoards(remoteBoards));
    const actionTypes = store.getActions().map(a => a.type);

    expect(actionTypes[0]).toBe(types.SYNC_BOARDS_STARTED);
    expect(actionTypes).toContain(types.SYNC_BOARDS_SUCCESS);
    expect(actionTypes).not.toContain(types.SYNC_BOARDS_FAILURE);
  });

  it('should apply remote changes and push local changes', async () => {
    const remoteBoard = { id: 'new-remote-board', name: 'From Server' };
    const store = mockStore(initialState);

    await store.dispatch(actions.syncBoards([remoteBoard]));
    const actionTypes = store.getActions().map(a => a.type);

    // PULL: should add the new remote board
    expect(actionTypes).toContain(types.ADD_BOARDS);
    // Should complete sync
    expect(actionTypes).toContain(types.SYNC_BOARDS_SUCCESS);
  });

  it('should return success: true on successful sync', async () => {
    const store = mockStore(initialState);

    const result = await store.dispatch(actions.syncBoards([]));

    expect(result).toEqual({ success: true });
  });

  it('should update local boards when remote is newer (PULL)', async () => {
    const localBoard = {
      ...mockBoard,
      id: '12345678901234567890',
      lastEdited: '2024-01-01T00:00:00Z'
    };
    const store = mockStore({
      ...initialState,
      board: {
        ...initialState.board,
        boards: [localBoard],
        syncMeta: {
          '12345678901234567890': { status: types.SYNC_STATUS.SYNCED }
        }
      }
    });
    const remoteBoards = [
      { ...localBoard, name: 'Updated', lastEdited: '2024-01-02T00:00:00Z' }
    ];

    await store.dispatch(actions.syncBoards(remoteBoards));
    const updateActions = store
      .getActions()
      .filter(a => a.type === types.UPDATE_BOARD);

    expect(updateActions).toHaveLength(1);
  });

  it('should handle boards deleted on server with 404 (PULL)', async () => {
    const API = require('../../../api/api').default;
    API.getBoard = jest.fn().mockRejectedValue({
      response: { status: 404 }
    });

    const localBoard = { ...mockBoard, id: '12345678901234567890' };
    const store = mockStore({
      ...initialState,
      board: {
        ...initialState.board,
        boards: [localBoard],
        syncMeta: {
          '12345678901234567890': { status: types.SYNC_STATUS.SYNCED }
        }
      }
    });

    await store.dispatch(actions.syncBoards([]));
    const dispatchedActions = store.getActions();

    expect(dispatchedActions).toContainEqual({
      type: types.DELETE_API_BOARD_SUCCESS,
      board: { id: '12345678901234567890' }
    });
  });

  it('should update board when server still has it despite not being in remote list (PULL)', async () => {
    const API = require('../../../api/api').default;
    const serverBoard = { id: '12345678901234567890', name: 'Still on server' };
    API.getBoard = jest.fn().mockResolvedValue(serverBoard);

    const localBoard = { ...mockBoard, id: '12345678901234567890' };
    const store = mockStore({
      ...initialState,
      board: {
        ...initialState.board,
        boards: [localBoard],
        syncMeta: {
          '12345678901234567890': { status: types.SYNC_STATUS.SYNCED }
        }
      }
    });

    await store.dispatch(actions.syncBoards([]));
    const updateActions = store
      .getActions()
      .filter(a => a.type === types.UPDATE_BOARD);

    expect(updateActions).toHaveLength(1);
  });

  it('should push locally modified boards with syncMeta PENDING (PUSH)', async () => {
    const pendingBoard = { ...mockBoard, id: '12345678901234567890' };
    const store = mockStore({
      ...initialState,
      board: {
        ...initialState.board,
        boards: [pendingBoard],
        syncMeta: {
          '12345678901234567890': { status: types.SYNC_STATUS.PENDING }
        }
      }
    });

    await store.dispatch(actions.syncBoards([pendingBoard]));
    const actionTypes = store.getActions().map(a => a.type);

    expect(actionTypes).toContain(types.UPDATE_API_BOARD_STARTED);
  });

  it('should create server boards for short ID pending boards (PUSH)', async () => {
    const localBoard = { ...mockBoard, id: 'short123' };
    const store = mockStore({
      ...initialState,
      board: {
        ...initialState.board,
        boards: [localBoard],
        syncMeta: { short123: { status: types.SYNC_STATUS.PENDING } }
      }
    });

    await store.dispatch(actions.syncBoards([]));
    const actionTypes = store.getActions().map(a => a.type);

    expect(actionTypes).toContain(types.CREATE_API_BOARD_STARTED);
  });

  it('should delete locally deleted boards from server (PUSH)', async () => {
    const deletedBoard = { ...mockBoard, id: '12345678901234567890' };
    const store = mockStore({
      ...initialState,
      board: {
        ...initialState.board,
        boards: [deletedBoard],
        syncMeta: {
          '12345678901234567890': {
            status: types.SYNC_STATUS.PENDING,
            isDeleted: true
          }
        }
      }
    });

    await store.dispatch(actions.syncBoards([]));
    const actionTypes = store.getActions().map(a => a.type);

    expect(actionTypes).toContain(types.DELETE_API_BOARD_STARTED);
  });

  it('should dispatch syncBoardsFailure and return failure on error', async () => {
    const result = await mockStore(initialState).dispatch(
      actions.syncBoards(null)
    );
    expect(result.success).toBe(false);
  });

  it('should execute PULL before PUSH in correct order', async () => {
    const pendingBoard = { ...mockBoard, id: '12345678901234567890' };
    const newRemoteBoard = { id: 'new-remote-board', name: 'From Server' };
    const store = mockStore({
      ...initialState,
      board: {
        ...initialState.board,
        boards: [pendingBoard],
        syncMeta: {
          '12345678901234567890': { status: types.SYNC_STATUS.PENDING }
        }
      }
    });

    await store.dispatch(actions.syncBoards([newRemoteBoard]));
    const actionTypes = store.getActions().map(a => a.type);

    const addBoardsIndex = actionTypes.indexOf(types.ADD_BOARDS);
    const pushIndex = actionTypes.indexOf(types.UPDATE_API_BOARD_STARTED);

    // PULL (ADD_BOARDS) should happen before PUSH (UPDATE_API_BOARD_STARTED)
    expect(addBoardsIndex).toBeGreaterThan(-1);
    expect(pushIndex).toBeGreaterThan(-1);
    expect(addBoardsIndex).toBeLessThan(pushIndex);
  });
});
