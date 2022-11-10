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
    const expectedAction = {
      type: types.PREVIOUS_BOARD
    };
    expect(actions.previousBoard()).toEqual(expectedAction);
  });

  it('should create an action to REPLACE_ME', () => {
    const expectedAction = {
      type: types.TO_ROOT_BOARD
    };
    expect(actions.toRootBoard()).toEqual(expectedAction);
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
    const expectedAction = {
      type: types.CHANGE_OUTPUT,
      output
    };
    expect(actions.changeOutput(output)).toEqual(expectedAction);
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
    const board = {};
    const expectedAction = {
      type: types.UPDATE_API_BOARD_SUCCESS,
      board
    };
    expect(actions.updateApiBoardSuccess(board)).toEqual(expectedAction);
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
