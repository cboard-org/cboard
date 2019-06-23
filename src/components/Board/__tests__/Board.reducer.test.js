import * as actions from '../Board.actions';
import * as types from '../Board.constants';
import boardReducer from '../Board.reducer';
import defaultBoards from '../../../api/boards.json';
import {
  IMPORT_BOARDS,
  ADD_BOARDS,
  CHANGE_BOARD,
  SWITCH_BOARD,
  PREVIOUS_BOARD,
  DELETE_BOARD,
  CREATE_BOARD,
  UPDATE_BOARD,
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
} from '../Board.constants';

const mockBoard = { name: 'tewt', id: '123', tiles: [], isPublic: false, email: 'asd@qwe.com', markToUpdate: true   };
const [...boards] = defaultBoards.advanced;
const initialState = {
  boards,
  output: [],
  activeBoardId: null,
  navHistory: [],
  isFetching: false
};

describe('reducer', () => {
  it('should return the initial state', () => {
    expect(boardReducer(undefined, {})).toEqual(initialState);
  });
  it('should handle createApiBoardStarted', () => {
    const createApiBoardStarted = {
      type: CREATE_API_BOARD_STARTED
    };
    expect(boardReducer(initialState, createApiBoardStarted)).toEqual({ ...initialState, isFetching: true });
  });
  it('should handle deleteApiBoardStarted', () => {
    const deleteApiBoardStarted = {
      type: DELETE_API_BOARD_STARTED
    };
    expect(boardReducer(initialState, deleteApiBoardStarted)).toEqual({ ...initialState, isFetching: true });
  });
  it('should handle getApiMyBoardsStarted', () => {
    const getApiMyBoardsStarted = {
      type: GET_API_MY_BOARDS_STARTED
    };
    expect(boardReducer(initialState, getApiMyBoardsStarted)).toEqual({ ...initialState, isFetching: true });
  });
  it('should handle updateApiBoardStarted', () => {
    const updateApiBoardStarted = {
      type: UPDATE_API_BOARD_STARTED
    };
    expect(boardReducer(initialState, updateApiBoardStarted)).toEqual({ ...initialState, isFetching: true });
  });
  it('should handle createApiBoardFailure', () => {
    const createApiBoardFailure = {
      type: CREATE_API_BOARD_FAILURE
    };
    expect(boardReducer(initialState, createApiBoardFailure)).toEqual({ ...initialState, isFetching: false });
  });
  it('should handle deleteApiBoardFailure', () => {
    const deleteApiBoardFailure = {
      type: DELETE_API_BOARD_FAILURE
    };
    expect(boardReducer(initialState, deleteApiBoardFailure)).toEqual({ ...initialState, isFetching: false });
  });
  it('should handle getApiMyBoardsFailure', () => {
    const getApiMyBoardsFailure = {
      type: GET_API_MY_BOARDS_FAILURE
    };
    expect(boardReducer(initialState, getApiMyBoardsFailure)).toEqual({ ...initialState, isFetching: false });
  });
  it('should handle updateApiBoardFailure', () => {
    const updateApiBoardFailure = {
      type: UPDATE_API_BOARD_FAILURE
    };
    expect(boardReducer(initialState, updateApiBoardFailure)).toEqual({ ...initialState, isFetching: false });
  });
  it('should handle createApiBoardSuccess', () => {
    const createApiBoardSuccess = {
      type: CREATE_API_BOARD_SUCCESS,
      board: mockBoard,
      boardId: '456'
    };
    expect(boardReducer(initialState, createApiBoardSuccess)).toEqual({ ...initialState, isFetching: false });
  });
  it('should handle deleteApiBoardSuccess', () => {
    const deleteApiBoardSuccess = {
      type: DELETE_API_BOARD_SUCCESS,
      board: mockBoard
    };
    expect(boardReducer(initialState, deleteApiBoardSuccess)).toEqual({
      ...initialState,
      boards: [
        ...initialState.boards.filter(board => board.id !== '123')
      ],
      isFetching: false
    });
  });
  it('should handle getApiMyBoardsSuccess', () => {
    const getApiMyBoardsSuccess = {
      type: GET_API_MY_BOARDS_SUCCESS,
      boards: { data: [mockBoard, mockBoard] }
    };
    expect(boardReducer(initialState, getApiMyBoardsSuccess)).toEqual({ ...initialState, boards: [...initialState.boards, mockBoard], isFetching: false });
  });
  it('should handle updateApiBoardSuccess', () => {
    const updateApiBoardSuccess = {
      type: UPDATE_API_BOARD_SUCCESS,
      board: mockBoard
    };
    expect(boardReducer(initialState, updateApiBoardSuccess)).toEqual({ ...initialState, isFetching: false });
  });
  it('should handle unmarkBoard', () => {
    const unmarkBoard = {
      type: UNMARK_BOARD,
      boardId: '123'
    };
    expect(boardReducer({ ...initialState, boards: [...initialState.boards, mockBoard] }, unmarkBoard)).toEqual({
      ...initialState,
      boards: [
        ...initialState.boards.filter(board => board.id !== '123'),
        { ...mockBoard, markToUpdate: false }
      ]
    });
  });
  it('should handle historyRemovePreviousBoard', () => {
    const historyRemovePreviousBoard = {
      type: HISTORY_REMOVE_PREVIOUS_BOARD,
      boardId: 'root'
    };
    expect(boardReducer({
      ...initialState,
      navHistory: ['root', 'a', 'b']
    },
      historyRemovePreviousBoard)).toEqual({
        ...initialState,
        navHistory: ['root', 'a'],
        activeBoardId: "root"
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
    expect(boardReducer({
      ...initialState,
      boards: [...initialState.boards, mockBoard]
    },
      replaceBoard)).toEqual({
        ...initialState,
        boards: [...initialState.boards, mockBoard, { ...mockBoard, id: '456' }]
      });
  });
  it('should handle addBoards', () => {
    const addBoards = {
      type: actions.addBoards,
      boards: ['b1', 'b2']
    };
    expect(boardReducer(initialState, addBoards)).toEqual(initialState);
  });
  it('should handle changeBoard', () => {
    const changeBoard = {
      type: actions.changeBoard,
      boardId: 'b1'
    };
    expect(boardReducer(initialState, changeBoard)).toEqual(initialState);
  });


});
