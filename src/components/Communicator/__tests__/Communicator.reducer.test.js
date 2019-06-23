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

const defaultCommunicatorID = 'cboard_default';
const initialState = {
  communicators: defaultCommunicators,
  activeCommunicatorId: defaultCommunicatorID
};


describe('reducer', () => {
  it('should return the initial state', () => {
    expect(communicatorReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle getApiMyCommunicatorsStarted', () => {
    const getApiMyCommunicatorsStarted = {
      type: GET_API_MY_COMMUNICATORS_STARTED
    };
    expect(communicatorReducer(initialState, getApiMyCommunicatorsStarted)).toEqual({ ...initialState, isFetching: true});
  });
  it('should handle createApiMyCommunicatorsStarted', () => {
    const createApiMyCommunicatorsStarted = {
      type: CREATE_API_COMMUNICATOR_STARTED
    };
    expect(communicatorReducer(initialState, createApiMyCommunicatorsStarted)).toEqual({ ...initialState, isFetching: true });
  });
  it('should handle updateApiMyCommunicatorsStarted', () => {
    const updateApiMyCommunicatorsStarted = {
      type: UPDATE_API_COMMUNICATOR_STARTED
    };
    expect(communicatorReducer(initialState, updateApiMyCommunicatorsStarted)).toEqual({ ...initialState, isFetching: true });
  });
  it('should handle getApiMyCommunicatorsFailure', () => {
    const getApiMyCommunicatorsFailure = {
      type: GET_API_MY_COMMUNICATORS_FAILURE
    };
    expect(communicatorReducer(initialState, getApiMyCommunicatorsFailure)).toEqual({ ...initialState, isFetching: false });
  });
  it('should handle createApiMyCommunicatorsFailure', () => {
    const createApiMyCommunicatorsFailure = {
      type: CREATE_API_COMMUNICATOR_FAILURE
    };
    expect(communicatorReducer(initialState, createApiMyCommunicatorsFailure)).toEqual({ ...initialState, isFetching: false });
  });
  it('should handle updateApiMyCommunicatorsFailure', () => {
    const updateApiMyCommunicatorsFailure = {
      type: UPDATE_API_COMMUNICATOR_FAILURE
    };
    expect(communicatorReducer(initialState, updateApiMyCommunicatorsFailure)).toEqual({ ...initialState, isFetching: false });
  });

});
