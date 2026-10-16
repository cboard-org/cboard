import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import API from '../../../api/api';
import history from '../../../history';
import boardReducer from '../Board.reducer';
import communicatorReducer from '../../Communicator/Communicator.reducer';
import {
  previousBoard,
  pushLocalChangesToApi,
  switchBoard
} from '../Board.actions';
import { SYNC_STATUS } from '../Board.constants';

jest.mock('../../../api/api', () => ({
  createBoard: jest.fn(),
  uploadBoardLocalMedia: jest.fn(),
  updateCommunicator: jest.fn()
}));
jest.mock('../../../history', () => require('history').createMemoryHistory());

const localId = 'local123';
const serverId = 'cccccccccccccccccccccccc';
const rootId = 'aaaaaaaaaaaaaaaaaaaaaaaa';
const otherId = 'bbbbbbbbbbbbbbbbbbbbbbbb';
const userData = { email: 'user@example.com', name: 'User' };
const board = (id) => ({ id, name: id, email: userData.email, tiles: [] });
const communicator = {
  id: 'dddddddddddddddddddddddd',
  email: userData.email,
  rootBoard: rootId,
  boards: [rootId, localId, otherId]
};

function setup() {
  const initial = {
    board: {
      ...boardReducer(undefined, {}),
      boards: [board(rootId), board(localId), board(otherId)],
      activeBoardId: localId,
      navHistory: [rootId, localId, otherId, localId],
      syncMeta: {
        [rootId]: { status: SYNC_STATUS.SYNCED },
        [localId]: { status: SYNC_STATUS.PENDING },
        [otherId]: { status: SYNC_STATUS.SYNCED }
      }
    },
    communicator: {
      communicators: [{ ...communicator, boards: [...communicator.boards] }],
      activeCommunicatorId: communicator.id
    }
  };
  return createStore(
    combineReducers({
      board: boardReducer,
      communicator: communicatorReducer,
      app: () => ({ userData }),
      language: () => ({ lang: 'en-US' })
    }),
    initial,
    applyMiddleware(thunk)
  );
}

beforeEach(() => {
  jest.resetAllMocks();
  jest.spyOn(console, 'error').mockImplementation(() => {});
  history.replace(`/board/${localId}?view=board#tile`, { from: 'test' });
  API.createBoard.mockResolvedValue(board(serverId));
  API.uploadBoardLocalMedia.mockImplementation(async (value) => ({
    board: value,
    hadFailure: false
  }));
  API.updateCommunicator.mockResolvedValue(communicator);
});

afterEach(() => jest.restoreAllMocks());

it.each([false, true])(
  'keeps navigation on the created board when communicator upload fails: %s',
  async (failCommunicator) => {
    if (failCommunicator) {
      API.updateCommunicator.mockRejectedValue(
        new Error('Communicator unavailable')
      );
    }
    const store = setup();

    await store.dispatch(pushLocalChangesToApi());

    expect(API.createBoard).toHaveBeenCalledTimes(1);
    expect(API.updateCommunicator).toHaveBeenCalledTimes(1);
    expect(store.getState().board.activeBoardId).toBe(serverId);
    expect(store.getState().board.navHistory).toEqual([
      rootId,
      serverId,
      otherId,
      serverId
    ]);
    expect(history.location).toMatchObject({
      pathname: `/board/${serverId}`,
      search: '?view=board',
      hash: '#tile',
      state: { from: 'test' }
    });
    store.dispatch(previousBoard());
    expect(store.getState().board.activeBoardId).toBe(otherId);
    store.dispatch(previousBoard());
    expect(store.getState().board.activeBoardId).toBe(serverId);
  }
);

it('keeps the local identity and URL when board creation fails', async () => {
  API.createBoard.mockRejectedValue(new Error('Create unavailable'));
  const store = setup();

  await store.dispatch(pushLocalChangesToApi());

  expect(store.getState().board.activeBoardId).toBe(localId);
  expect(store.getState().board.navHistory).toEqual([
    rootId,
    localId,
    otherId,
    localId
  ]);
  expect(history.location.pathname).toBe(`/board/${localId}`);
  expect(API.updateCommunicator).not.toHaveBeenCalled();
});

it.each(['/settings', `/board/${otherId}`])(
  'does not pull the user back after they navigate to %s during creation',
  async (destination) => {
    let finishCreate;
    let notifyStarted;
    const started = new Promise((resolve) => {
      notifyStarted = resolve;
    });
    API.createBoard.mockImplementation(() => {
      notifyStarted();
      return new Promise((resolve) => {
        finishCreate = resolve;
      });
    });
    const store = setup();
    const push = store.dispatch(pushLocalChangesToApi());
    await started;
    store.dispatch(switchBoard(otherId));
    history.push(destination);
    finishCreate(board(serverId));

    await push;

    expect(history.location.pathname).toBe(destination);
    expect(store.getState().board.activeBoardId).toBe(otherId);
    expect(store.getState().board.navHistory).toEqual([otherId]);
  }
);
