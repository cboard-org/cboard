import * as actions from '../Communicator.actions';
import communicatorReducer from '../Communicator.reducer';
import defaultCommunicators from '../../../api/communicators.json';
import {
  IMPORT_COMMUNICATOR,
  CREATE_COMMUNICATOR,
  EDIT_COMMUNICATOR,
  DELETE_COMMUNICATOR,
  CHANGE_COMMUNICATOR,
  ADD_BOARD_COMMUNICATOR,
  DELETE_BOARD_COMMUNICATOR,
  REPLACE_BOARD_COMMUNICATOR,
  CREATE_API_COMMUNICATOR_SUCCESS,
  CREATE_API_COMMUNICATOR_FAILURE,
  CREATE_API_COMMUNICATOR_STARTED,
  UPDATE_API_COMMUNICATOR_SUCCESS,
  UPDATE_API_COMMUNICATOR_FAILURE,
  UPDATE_API_COMMUNICATOR_STARTED,
  GET_API_MY_COMMUNICATORS_SUCCESS,
  GET_API_MY_COMMUNICATORS_FAILURE,
  GET_API_MY_COMMUNICATORS_STARTED
} from '../Communicator.constants';
import { LOGIN_SUCCESS, LOGOUT } from '../../Account/Login/Login.constants';

let mockComm, defaultCommunicatorID, initialState;
describe('reducer', () => {
  beforeEach(() => {
    mockComm = {
      author: 'martin bedouret',
      boards: ['1', '2', '3'],
      description: "Cboard's default communicator",
      email: 'anything@cboard.io',
      id: '123',
      name: "Cboard's Communicator",
      rootBoard: '1'
    };
    defaultCommunicatorID = 'cboard_default';
    initialState = {
      communicators: defaultCommunicators,
      activeCommunicatorId: defaultCommunicatorID
    };
  });

  it('should return the initial state', () => {
    expect(communicatorReducer(undefined, {})).toEqual(initialState);
  });
  it('should handle login ', () => {
    const login = {
      type: LOGIN_SUCCESS,
      payload: mockComm
    };
    expect(communicatorReducer(initialState, login)).toEqual(initialState);
  });
  it('should handle logout', () => {
    const logout = {
      type: LOGOUT
    };
    expect(communicatorReducer(initialState, logout)).toEqual(initialState);
  });
  it('should handle getApiMyCommunicatorsStarted', () => {
    const getApiMyCommunicatorsStarted = {
      type: GET_API_MY_COMMUNICATORS_STARTED
    };
    expect(
      communicatorReducer(initialState, getApiMyCommunicatorsStarted)
    ).toEqual({ ...initialState, isFetching: true });
  });
  it('should handle createApiMyCommunicatorsStarted', () => {
    const createApiMyCommunicatorsStarted = {
      type: CREATE_API_COMMUNICATOR_STARTED
    };
    expect(
      communicatorReducer(initialState, createApiMyCommunicatorsStarted)
    ).toEqual({ ...initialState, isFetching: true });
  });
  it('should handle updateApiMyCommunicatorsStarted', () => {
    const updateApiMyCommunicatorsStarted = {
      type: UPDATE_API_COMMUNICATOR_STARTED
    };
    expect(
      communicatorReducer(initialState, updateApiMyCommunicatorsStarted)
    ).toEqual({ ...initialState, isFetching: true });
  });
  it('should handle getApiMyCommunicatorsFailure', () => {
    const getApiMyCommunicatorsFailure = {
      type: GET_API_MY_COMMUNICATORS_FAILURE
    };
    expect(
      communicatorReducer(initialState, getApiMyCommunicatorsFailure)
    ).toEqual({ ...initialState, isFetching: false });
  });
  it('should handle createApiMyCommunicatorsFailure', () => {
    const createApiMyCommunicatorsFailure = {
      type: CREATE_API_COMMUNICATOR_FAILURE
    };
    expect(
      communicatorReducer(initialState, createApiMyCommunicatorsFailure)
    ).toEqual({ ...initialState, isFetching: false });
  });
  it('should handle updateApiMyCommunicatorsFailure', () => {
    const updateApiMyCommunicatorsFailure = {
      type: UPDATE_API_COMMUNICATOR_FAILURE
    };
    expect(
      communicatorReducer(initialState, updateApiMyCommunicatorsFailure)
    ).toEqual({ ...initialState, isFetching: false });
  });
  it('should handle getApiMyCommunicatorsSuccess', () => {
    const getApiMyCommunicatorsSuccess = {
      type: GET_API_MY_COMMUNICATORS_SUCCESS,
      communicators: { data: mockComm }
    };
    expect(
      communicatorReducer(initialState, getApiMyCommunicatorsSuccess)
    ).toEqual({ ...initialState, isFetching: false });
  });
  it('should handle createApiCommunicatorSuccess', () => {
    const createApiCommunicatorSuccess = {
      type: CREATE_API_COMMUNICATOR_SUCCESS
    };
    expect(
      communicatorReducer(initialState, createApiCommunicatorSuccess)
    ).toEqual({ ...initialState, isFetching: false });
  });
  it('should handle updateApiCommunicatorSuccess', () => {
    const updateApiCommunicatorSuccess = {
      type: UPDATE_API_COMMUNICATOR_SUCCESS
    };
    expect(
      communicatorReducer(initialState, updateApiCommunicatorSuccess)
    ).toEqual({ ...initialState, isFetching: false });
  });
  it('should handle replaceBoardCommunicator', () => {
    const replaceBoardCommunicator = {
      type: REPLACE_BOARD_COMMUNICATOR,
      prevBoardId: '1',
      nextBoardId: '2'
    };
    expect(
      communicatorReducer(
        {
          ...initialState,
          communicators: [...initialState.communicators, mockComm],
          activeCommunicatorId: '123'
        },
        replaceBoardCommunicator
      )
    ).toEqual({
      ...initialState,
      activeCommunicatorId: '123',
      communicators: [
        ...initialState.communicators,
        {
          ...mockComm,
          boards: ['2', '2', '3']
        }
      ]
    });
  });
  it('should handle deleteBoardCommunicator', () => {
    const deleteBoardCommunicator = {
      type: DELETE_BOARD_COMMUNICATOR,
      boardId: '3'
    };
    expect(
      communicatorReducer(
        {
          ...initialState,
          communicators: [...initialState.communicators, mockComm],
          activeCommunicatorId: '123'
        },
        deleteBoardCommunicator
      )
    ).toEqual({
      ...initialState,
      activeCommunicatorId: '123',
      communicators: [
        ...initialState.communicators,
        {
          ...mockComm,
          boards: ['1', '2']
        }
      ]
    });
  });
  it('should handle addBoardCommunicator', () => {
    const addBoardCommunicator = {
      type: ADD_BOARD_COMMUNICATOR,
      boardId: '4'
    };
    expect(
      communicatorReducer(
        {
          ...initialState,
          communicators: [...initialState.communicators, mockComm],
          activeCommunicatorId: '123'
        },
        addBoardCommunicator
      )
    ).toEqual({
      ...initialState,
      activeCommunicatorId: '123',
      communicators: [
        ...initialState.communicators,
        {
          ...mockComm,
          boards: ['1', '2', '3', '4']
        }
      ]
    });
  });
  it('should handle addBoardCommunicator', () => {
    const addBoardCommunicator = {
      type: CHANGE_COMMUNICATOR,
      payload: 'cboard_default'
    };
    expect(
      communicatorReducer(
        {
          ...initialState,
          communicators: [...initialState.communicators, mockComm],
          activeCommunicatorId: '123'
        },
        addBoardCommunicator
      )
    ).toEqual({
      ...initialState,
      activeCommunicatorId: 'cboard_default',
      communicators: [...initialState.communicators, mockComm]
    });
  });
  it('should handle deleteCommunicator', () => {
    const deleteCommunicator = {
      type: DELETE_COMMUNICATOR,
      payload: 'cboard_default'
    };
    expect(
      communicatorReducer(
        {
          ...initialState,
          communicators: [...initialState.communicators, mockComm],
          activeCommunicatorId: '123'
        },
        deleteCommunicator
      )
    ).toEqual({
      ...initialState,
      activeCommunicatorId: '123',
      communicators: [mockComm]
    });
  });
  it('should handle editCommunicator', () => {
    const editCommunicator = {
      type: EDIT_COMMUNICATOR,
      payload: mockComm
    };
    expect(
      communicatorReducer(
        {
          ...initialState,
          communicators: [...initialState.communicators, mockComm],
          activeCommunicatorId: '123'
        },
        editCommunicator
      )
    ).toEqual({
      ...initialState,
      activeCommunicatorId: '123',
      communicators: [...initialState.communicators, mockComm]
    });
  });
  it('should handle createCommunicator', () => {
    const createCommunicator = {
      type: CREATE_COMMUNICATOR,
      payload: mockComm
    };
    expect(communicatorReducer(initialState, createCommunicator)).toEqual({
      ...initialState,
      communicators: [...initialState.communicators, mockComm]
    });
  });
  it('should handle importCommunicator', () => {
    const importCommunicator = {
      type: IMPORT_COMMUNICATOR,
      payload: mockComm
    };
    expect(communicatorReducer(initialState, importCommunicator)).toEqual({
      ...initialState,
      communicators: [...initialState.communicators, mockComm]
    });
  });
});
