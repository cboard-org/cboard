import * as actions from '../Board.actions';
import * as types from '../Board.constants';
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import defaultBoards from '../../../api/boards.json';

 const mockStore = configureMockStore([thunk]);

const mockBoard = {
  name: 'tewt',
  id: '123',
  tiles: [{ id: '1234', loadBoard: '456456456456456456456' }],
  isPublic: false,
  email: 'asd@qwe.com',
  markToUpdate: true
};
const [...boards] = defaultBoards.advanced;
const initialState = {
  board: {
    boards,
    output: [],
    activeBoardId: null,
    navHistory: [],
    isFetching: false
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
    const boardId = '123';
    const expectedAction = {
      type: types.HISTORY_REMOVE_PREVIOUS_BOARD,
      boardId
    };
    expect(actions.historyRemovePreviousBoard(boardId)).toEqual(expectedAction);
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
  it('check getApiObjects', async () => {

    const store = mockStore();
    await store.dispatch(actions.getApiObjects());
  });
  it('check updateApiMarkedBoards', async () => {
    const store = mockStore(initialState);
    await store.dispatch(actions.updateApiMarkedBoards());
  });
});
