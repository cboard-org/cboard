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
  GET_API_MY_BOARDS_STARTED
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
const [...boards] = defaultBoards.advanced;
const initialState = {
  boards,
  output: [],
  activeBoardId: null,
  navHistory: [],
  isFetching: false,
  isFixed: false,
  images: [],
  isLiveMode: false
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
      navHistory: [null]
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
          ...mockBoard
        }
      ],
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
      isFetching: false
    });
  });
  it('should handle getApiMyBoardsSuccess', () => {
    const getApiMyBoardsSuccess = {
      type: GET_API_MY_BOARDS_SUCCESS,
      boards: { data: [mockBoard, mockBoard] }
    };
    expect(boardReducer(initialState, getApiMyBoardsSuccess)).toEqual({
      ...initialState,
      boards: [...initialState.boards, mockBoard],
      isFetching: false
    });
  });
  it('should handle updateApiBoardSuccess', () => {
    const updateApiBoardSuccess = {
      type: UPDATE_API_BOARD_SUCCESS,
      board: mockBoard
    };
    expect(boardReducer(initialState, updateApiBoardSuccess)).toEqual({
      ...initialState,
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
      boards: [...initialState.boards, mockBoard]
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
              loadBoard: '123'
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
  it('should handle deleteBoard', () => {
    const deleteBoard = {
      type: DELETE_BOARD,
      boardId: '123'
    };
    expect(
      boardReducer(
        {
          ...initialState,
          boards: [...initialState.boards, mockBoard]
        },
        deleteBoard
      )
    ).toEqual(initialState);
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
  it('should handle addBoards', () => {
    const addBoards = {
      type: ADD_BOARDS,
      boards: mockBoard
    };
    expect(boardReducer(initialState, addBoards)).toEqual({
      ...initialState,
      boards: [...initialState.boards, mockBoard]
    });
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
});
