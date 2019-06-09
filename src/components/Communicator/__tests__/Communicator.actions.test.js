import * as actions from '../Communicator.actions';
import * as types from '../Communicator.constants';

describe('actions', () => {
  it('should create an action to REPLACE', () => {
    const payload = {};

    const expectedAction = {
      type: types.IMPORT_COMMUNICATOR,
      payload
    };
    expect(actions.importCommunicator(payload)).toEqual(expectedAction);
  });

  it('should create an action to REPLACE', () => {
    const payload = {};
    const expectedAction = {
      type: types.CREATE_COMMUNICATOR,
      payload
    };
    expect(actions.createCommunicator(payload)).toEqual(expectedAction);
  });

  it('should create an action to REPLACE', () => {
    const payload = {};
    const expectedAction = {
      type: types.EDIT_COMMUNICATOR,
      payload
    };
    expect(actions.editCommunicator(payload)).toEqual(expectedAction);
  });

  it('should create an action to REPLACE', () => {
    const id = {};
    const expectedAction = {
      type: types.DELETE_COMMUNICATOR,
      payload: id
    };
    expect(actions.deleteCommunicator(id)).toEqual(expectedAction);
  });

  it('should create an action to REPLACE', () => {
    const id = {};
    const expectedAction = {
      type: types.CHANGE_COMMUNICATOR,
      payload: id
    };
    expect(actions.changeCommunicator(id)).toEqual(expectedAction);
  });

  it('should create an action to REPLACE', () => {
    const boardId = {};
    const expectedAction = {
      type: types.ADD_BOARD_COMMUNICATOR,
      boardId
    };
    expect(actions.addBoardCommunicator(boardId)).toEqual(expectedAction);
  });

  it('should create an action to REPLACE', () => {
    const boardId = {};
    const expectedAction = {
      type: types.DELETE_BOARD_COMMUNICATOR,
      boardId
    };
    expect(actions.deleteBoardCommunicator(boardId)).toEqual(expectedAction);
  });

  it('should create an action to REPLACE', () => {
    const prevBoardId = '10';
    const nextBoardId = '20';
    const expectedAction = {
      type: types.REPLACE_BOARD_COMMUNICATOR,
      prevBoardId,
      nextBoardId
    };
    expect(actions.replaceBoardCommunicator(prevBoardId, nextBoardId)).toEqual(
      expectedAction
    );
  });

  it('should create an action to REPLACE', () => {
    const communicators = {};
    const expectedAction = {
      type: types.GET_API_MY_COMMUNICATORS_SUCCESS,
      communicators
    };
    expect(actions.getApiMyCommunicatorsSuccess(communicators)).toEqual(
      expectedAction
    );
  });

  it('should create an action to REPLACE', () => {
    const expectedAction = {
      type: types.GET_API_MY_COMMUNICATORS_STARTED
    };
    expect(actions.getApiMyCommunicatorsStarted()).toEqual(expectedAction);
  });

  it('should create an action to REPLACE', () => {
    const message = 'dummy message';
    const expectedAction = {
      type: types.GET_API_MY_COMMUNICATORS_FAILURE,
      message
    };
    expect(actions.getApiMyCommunicatorsFailure(message)).toEqual(
      expectedAction
    );
  });

  it('should create an action to REPLACE', () => {
    const communicator = {};
    const communicatorId = '10';

    const expectedAction = {
      type: types.CREATE_API_COMMUNICATOR_SUCCESS,
      communicator,
      communicatorId
    };

    expect(
      actions.createApiCommunicatorSuccess(communicator, communicatorId)
    ).toEqual(expectedAction);
  });

  it('should create an action to REPLACE', () => {
    const expectedAction = {
      type: types.CREATE_API_COMMUNICATOR_STARTED
    };
    expect(actions.createApiCommunicatorStarted()).toEqual(expectedAction);
  });

  it('should create an action to REPLACE', () => {
    const message = 'dummy message';
    const expectedAction = {
      type: types.CREATE_API_COMMUNICATOR_FAILURE,
      message
    };

    expect(actions.createApiCommunicatorFailure(message)).toEqual(
      expectedAction
    );
  });

  it('should create an action to REPLACE', () => {
    const communicator = {};
    const expectedAction = {
      type: types.UPDATE_API_COMMUNICATOR_SUCCESS,
      communicator
    };
    expect(actions.updateApiCommunicatorSuccess(communicator)).toEqual(
      expectedAction
    );
  });

  it('should create an action to REPLACE', () => {
    const expectedAction = {
      type: types.UPDATE_API_COMMUNICATOR_STARTED
    };
    expect(actions.updateApiCommunicatorStarted()).toEqual(expectedAction);
  });

  it('should create an action to REPLACE', () => {
    const message = 'dummy message';
    const expectedAction = {
      type: types.UPDATE_API_COMMUNICATOR_FAILURE,
      message
    };

    expect(actions.updateApiCommunicatorFailure(message)).toEqual(
      expectedAction
    );
  });
});
