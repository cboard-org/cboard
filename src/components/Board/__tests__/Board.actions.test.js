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

  it('should create an action to REPLACE_ME', () => {
    const boardData = {};
    const expectedAction = {
      type: types.UPDATE_BOARD,
      boardData
    };
    expect(actions.updateBoard(boardData)).toEqual(expectedAction);
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
    const boards = [{ id: '123' }];
    const expectedAction = {
      type: types.SYNC_BOARDS_SUCCESS,
      boards
    };
    expect(actions.syncBoardsSuccess(boards)).toEqual(expectedAction);
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

describe('reconcileBoardsByTimestamp', () => {
  it('should return local board when local is newer', () => {
    const local = { id: '1', lastEdited: '2024-01-02T00:00:00Z' };
    const remote = { id: '1', lastEdited: '2024-01-01T00:00:00Z' };
    expect(actions.reconcileBoardsByTimestamp(local, remote)).toBe(local);
  });

  it('should return remote board when remote is newer', () => {
    const local = { id: '1', lastEdited: '2024-01-01T00:00:00Z' };
    const remote = { id: '1', lastEdited: '2024-01-02T00:00:00Z' };
    expect(actions.reconcileBoardsByTimestamp(local, remote)).toBe(remote);
  });

  it('should return local board when timestamps are equal', () => {
    const local = { id: '1', lastEdited: '2024-01-01T00:00:00Z' };
    const remote = { id: '1', lastEdited: '2024-01-01T00:00:00Z' };
    expect(actions.reconcileBoardsByTimestamp(local, remote)).toBe(local);
  });

  it('should return local board when local has no lastEdited', () => {
    const local = { id: '1' };
    const remote = { id: '1', lastEdited: '2024-01-01T00:00:00Z' };
    expect(actions.reconcileBoardsByTimestamp(local, remote)).toBe(local);
  });

  it('should return local board when remote has no lastEdited', () => {
    const local = { id: '1', lastEdited: '2024-01-01T00:00:00Z' };
    const remote = { id: '1' };
    expect(actions.reconcileBoardsByTimestamp(local, remote)).toBe(local);
  });
});

describe('mergeBoards', () => {
  it('should add new remote boards to local', () => {
    const localBoards = [{ id: '1', name: 'Local Board' }];
    const remoteBoards = [{ id: '2', name: 'Remote Board' }];
    const result = actions.mergeBoards(localBoards, remoteBoards);

    expect(result.mergedBoards).toHaveLength(2);
    expect(result.mergedBoards).toContainEqual({
      id: '1',
      name: 'Local Board'
    });
    expect(result.mergedBoards).toContainEqual({
      id: '2',
      name: 'Remote Board'
    });
    expect(result.localNewerBoards).toHaveLength(0);
  });

  it('should reconcile boards with same id using timestamp', () => {
    const localBoards = [
      { id: '1', name: 'Local', lastEdited: '2024-01-01T00:00:00Z' }
    ];
    const remoteBoards = [
      { id: '1', name: 'Remote', lastEdited: '2024-01-02T00:00:00Z' }
    ];
    const result = actions.mergeBoards(localBoards, remoteBoards);

    expect(result.mergedBoards).toHaveLength(1);
    expect(result.mergedBoards[0].name).toBe('Remote');
    expect(result.localNewerBoards).toHaveLength(0);
  });

  it('should identify local-newer boards', () => {
    const localBoards = [
      { id: '1', name: 'Local', lastEdited: '2024-01-02T00:00:00Z' }
    ];
    const remoteBoards = [
      { id: '1', name: 'Remote', lastEdited: '2024-01-01T00:00:00Z' }
    ];
    const result = actions.mergeBoards(localBoards, remoteBoards);

    expect(result.mergedBoards).toHaveLength(1);
    expect(result.mergedBoards[0].name).toBe('Local');
    expect(result.localNewerBoards).toHaveLength(1);
    expect(result.localNewerBoards[0].name).toBe('Local');
  });
});

describe('getModifiedLocalBoards', () => {
  it('should return modified boards that exist locally but not remotely', () => {
    const userEmail = 'user@example.com';
    const localBoards = [
      { id: 'short123', email: 'user@example.com' },
      { id: 'remote1234567890123456', email: 'user@example.com' }
    ];
    const remoteIds = new Set(['remote1234567890123456']);

    const result = actions.getModifiedLocalBoards(
      localBoards,
      remoteIds,
      userEmail
    );

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('short123');
  });

  it('should exclude boards with different user email', () => {
    const userEmail = 'user@example.com';
    const localBoards = [
      { id: 'short123', email: 'user@example.com' },
      { id: 'otherBoard', email: 'other@example.com' } // different email - should be excluded
    ];
    const remoteIds = new Set([]);

    const result = actions.getModifiedLocalBoards(
      localBoards,
      remoteIds,
      userEmail
    );

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('short123');
  });

  it('should exclude boards with long ids', () => {
    const userEmail = 'user@example.com';
    const localBoards = [
      { id: 'short123', email: 'user@example.com' },
      { id: '12345678901234567890', email: 'user@example.com' } // longer than SHORT_ID_MAX_LENGTH (14)
    ];
    const remoteIds = new Set([]);

    const result = actions.getModifiedLocalBoards(
      localBoards,
      remoteIds,
      userEmail
    );

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('short123');
  });
});
