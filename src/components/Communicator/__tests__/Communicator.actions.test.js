import * as actions from '../Communicator.actions';
import * as types from '../Communicator.constants';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
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
const communicatorData = {
  author: 'Cboard Team',
  boards: ['root'],
  description: "Cboard's default communicator",
  email: 'support@cboard.io',
  id: 'cboard_default',
  name: "Cboard's Communicator",
  rootBoard: 'root'
};

const initialState = {
  board: {
    boards,
    output: [],
    activeBoardId: null,
    navHistory: [],
    isFetching: false
  },
  communicator: {
    communicators: [communicatorData]
  }
};

describe('actions', () => {
  it('should create an action to import communicator', () => {
    const payload = {};

    const expectedAction = {
      type: types.IMPORT_COMMUNICATOR,
      payload
    };
    expect(actions.importCommunicator(payload)).toEqual(expectedAction);
  });

  it('should create an action to create communicator', () => {
    const payload = {};
    const expectedAction = {
      type: types.CREATE_COMMUNICATOR,
      payload
    };
    expect(actions.createCommunicator(payload)).toEqual(expectedAction);
  });

  it('should create an action to edit communicator', () => {
    const payload = {};
    const expectedAction = {
      type: types.EDIT_COMMUNICATOR,
      payload
    };
    expect(actions.editCommunicator(payload)).toEqual(expectedAction);
  });

  it('should create an action to delete communicator', () => {
    const id = {};
    const expectedAction = {
      type: types.DELETE_COMMUNICATOR,
      payload: id
    };
    expect(actions.deleteCommunicator(id)).toEqual(expectedAction);
  });

  it('should create an action to change communicator', () => {
    const id = {};
    const expectedAction = {
      type: types.CHANGE_COMMUNICATOR,
      payload: id
    };
    expect(actions.changeCommunicator(id)).toEqual(expectedAction);
  });

  it('should create an action to add board communicator', () => {
    const boardId = {};
    const expectedAction = {
      type: types.ADD_BOARD_COMMUNICATOR,
      boardId
    };
    expect(actions.addBoardCommunicator(boardId)).toEqual(expectedAction);
  });

  it('should create an action to delete board communicator', () => {
    const boardId = {};
    const expectedAction = {
      type: types.DELETE_BOARD_COMMUNICATOR,
      boardId
    };
    expect(actions.deleteBoardCommunicator(boardId)).toEqual(expectedAction);
  });

  it('should create an action to replace board communicator', () => {
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

  it('should create an action to get API success', () => {
    const communicators = {};
    const expectedAction = {
      type: types.GET_API_MY_COMMUNICATORS_SUCCESS,
      communicators
    };
    expect(actions.getApiMyCommunicatorsSuccess(communicators)).toEqual(
      expectedAction
    );
  });

  it('should create an action to get API started', () => {
    const expectedAction = {
      type: types.GET_API_MY_COMMUNICATORS_STARTED
    };
    expect(actions.getApiMyCommunicatorsStarted()).toEqual(expectedAction);
  });

  it('should create an action to get API failure', () => {
    const message = 'dummy message';
    const expectedAction = {
      type: types.GET_API_MY_COMMUNICATORS_FAILURE,
      message
    };
    expect(actions.getApiMyCommunicatorsFailure(message)).toEqual(
      expectedAction
    );
  });

  it('should create an action to create API success', () => {
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

  it('should create an action to create API started', () => {
    const expectedAction = {
      type: types.CREATE_API_COMMUNICATOR_STARTED
    };
    expect(actions.createApiCommunicatorStarted()).toEqual(expectedAction);
  });

  it('should create an action to create API failure', () => {
    const message = 'dummy message';
    const expectedAction = {
      type: types.CREATE_API_COMMUNICATOR_FAILURE,
      message
    };

    expect(actions.createApiCommunicatorFailure(message)).toEqual(
      expectedAction
    );
  });

  it('should create an action to update API success', () => {
    const communicator = {};
    const expectedAction = {
      type: types.UPDATE_API_COMMUNICATOR_SUCCESS,
      communicator
    };
    expect(actions.updateApiCommunicatorSuccess(communicator)).toEqual(
      expectedAction
    );
  });

  it('should create an action to update API started', () => {
    const expectedAction = {
      type: types.UPDATE_API_COMMUNICATOR_STARTED
    };
    expect(actions.updateApiCommunicatorStarted()).toEqual(expectedAction);
  });

  it('should create an action to update API failure', () => {
    const message = 'dummy message';
    const expectedAction = {
      type: types.UPDATE_API_COMMUNICATOR_FAILURE,
      message
    };

    expect(actions.updateApiCommunicatorFailure(message)).toEqual(
      expectedAction
    );
  });
  it('should contain thunk functions', () => {
    expect(actions.updateApiCommunicator(communicatorData)).toBeDefined();
    expect(actions.createApiCommunicator(communicatorData, 'id')).toBeDefined();
    expect(actions.getApiMyCommunicators()).toBeDefined();
  });
});
