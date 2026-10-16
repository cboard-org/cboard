import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import API from '../../../api/api';
import boardReducer from '../Board.reducer';
import communicatorReducer from '../../Communicator/Communicator.reducer';
import {
  updateApiMarkedBoards,
  updateApiObjectsNoChild,
  updateApiObjects
} from '../Board.actions';
import { SYNC_STATUS } from '../Board.constants';

jest.mock('../../../api/api', () => ({
  uploadBoardLocalMedia: jest.fn(),
  updateBoard: jest.fn(),
  createBoard: jest.fn(),
  updateCommunicator: jest.fn()
}));

const ids = [
  'aaaaaaaaaaaaaaaaaaaaaaaa',
  'bbbbbbbbbbbbbbbbbbbbbbbb',
  'cccccccccccccccccccccccc'
];
const userData = { email: 'user@example.com', name: 'User' };
const markedBoard = (id) => ({
  id,
  name: id,
  email: userData.email,
  tiles: [],
  markToUpdate: true
});

function setup(boards) {
  return createStore(
    combineReducers({
      board: boardReducer,
      communicator: communicatorReducer,
      app: () => ({ userData }),
      language: () => ({ lang: 'en-US' })
    }),
    {
      board: {
        ...boardReducer(undefined, {}),
        boards,
        syncMeta: Object.fromEntries(
          boards.map((board) => [board.id, { status: SYNC_STATUS.PENDING }])
        )
      },
      communicator: {
        activeCommunicatorId: 'dddddddddddddddddddddddd',
        communicators: [
          {
            id: 'dddddddddddddddddddddddd',
            email: userData.email,
            rootBoard: boards[0].id,
            boards: boards.map((board) => board.id)
          }
        ]
      }
    },
    applyMiddleware(thunk)
  );
}

beforeEach(() => {
  jest.resetAllMocks();
  API.uploadBoardLocalMedia.mockImplementation(async (board) => ({
    board,
    hadFailure: false
  }));
  API.updateBoard.mockImplementation(async (board) => ({
    ...board,
    lastEdited: '2026-10-16'
  }));
  API.createBoard.mockImplementation(async (board) => ({
    ...board,
    id: 'eeeeeeeeeeeeeeeeeeeeeeee'
  }));
  API.updateCommunicator.mockImplementation(
    async (communicator) => communicator
  );
});

it('processes later boards and reports every failed update after the batch', async () => {
  const firstError = new Error('First update failed');
  const secondError = new Error('Second update failed');
  API.updateBoard
    .mockRejectedValueOnce(firstError)
    .mockRejectedValueOnce(secondError);
  const store = setup(ids.map(markedBoard));

  const failure = await store
    .dispatch(updateApiMarkedBoards())
    .catch((error) => error);

  expect(API.updateBoard.mock.calls.map(([board]) => board.id)).toEqual(ids);
  expect(failure).toMatchObject({
    failures: [
      { boardId: ids[0], operation: 'update', error: firstError },
      { boardId: ids[1], operation: 'update', error: secondError }
    ]
  });
  expect(failure.message).toContain(ids[0]);
  expect(failure.message).toContain(ids[1]);
  const state = store.getState().board;
  expect(state.boards.map((board) => board.markToUpdate)).toEqual([
    true,
    true,
    false
  ]);
  expect(state.syncMeta[ids[0]].status).toBe(SYNC_STATUS.PENDING);
  expect(state.syncMeta[ids[1]].status).toBe(SYNC_STATUS.PENDING);
  expect(state.syncMeta[ids[2]].status).toBe(SYNC_STATUS.SYNCED);
});

it('reports a failed create while still updating later boards', async () => {
  API.createBoard.mockRejectedValue(new Error('Create failed'));
  const local = {
    ...markedBoard('local123'),
    markToUpdate: false,
    shouldCreateBoard: true
  };
  const store = setup([local, markedBoard(ids[0])]);

  const failure = await store
    .dispatch(updateApiMarkedBoards())
    .catch((error) => error);

  expect(API.updateBoard).toHaveBeenCalledWith(
    expect.objectContaining({ id: ids[0] })
  );
  expect(failure).toMatchObject({
    failures: [
      { boardId: local.id, operation: 'create', error: expect.any(Error) }
    ]
  });
  expect(failure.failures[0].error.message).toBe('Create failed');
  expect(store.getState().board.syncMeta[local.id].status).toBe(
    SYNC_STATUS.PENDING
  );
  expect(store.getState().board.syncMeta[ids[0]].status).toBe(
    SYNC_STATUS.SYNCED
  );
});

it('resolves normally and clears update flags for a successful batch', async () => {
  const store = setup(ids.map(markedBoard));

  await expect(
    store.dispatch(updateApiMarkedBoards())
  ).resolves.toBeUndefined();

  expect(API.updateBoard).toHaveBeenCalledTimes(3);
  expect(
    store.getState().board.boards.every((board) => !board.markToUpdate)
  ).toBe(true);
  expect(
    Object.values(store.getState().board.syncMeta).every(
      (meta) => meta.status === SYNC_STATUS.SYNCED
    )
  ).toBe(true);
});

it('preserves failure details through the single-board cascade caller', async () => {
  const local = { ...markedBoard('local123'), markToUpdate: false };
  const store = setup([local, markedBoard(ids[0]), markedBoard(ids[1])]);
  API.updateBoard.mockRejectedValueOnce(new Error('Marked update failed'));

  await expect(
    store.dispatch(updateApiObjectsNoChild(local, true))
  ).rejects.toMatchObject({
    failures: [
      { boardId: ids[0], operation: 'update', error: expect.any(Error) }
    ]
  });

  expect(API.updateBoard.mock.calls.map(([board]) => board.id)).toEqual([
    ids[0],
    ids[1]
  ]);
  expect(store.getState().board.syncMeta[ids[1]].status).toBe(
    SYNC_STATUS.SYNCED
  );
});

it('awaits and reports marked-board failures through the parent/child caller', async () => {
  const child = { ...markedBoard('local123'), markToUpdate: false };
  const parent = {
    ...markedBoard(ids[0]),
    tiles: [{ id: 'folder', loadBoard: child.id }]
  };
  const store = setup([child, parent]);
  API.updateBoard.mockResolvedValueOnce({
    ...parent,
    lastEdited: '2026-10-16'
  });
  API.updateBoard.mockRejectedValueOnce(
    new Error('Later marked update failed')
  );

  await expect(
    store.dispatch(updateApiObjects(child, parent))
  ).rejects.toMatchObject({
    failures: [
      { boardId: parent.id, operation: 'update', error: expect.any(Error) }
    ]
  });

  expect(API.updateBoard).toHaveBeenCalledTimes(2);
  expect(
    store.getState().board.boards.find((board) => board.id === parent.id)
      .markToUpdate
  ).toBe(true);
});
