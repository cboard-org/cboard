import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import useBoardActions from './useBoardActions';
import { SECTIONS } from '../CommunicatorDialog.constants';

jest.mock('../../../../api', () => ({
  __esModule: true,
  default: {
    getBoard: jest.fn(),
    boardReport: jest.fn(),
    updateBoard: jest.fn()
  }
}));

jest.mock('../CommunicatorDialog.messages', () => ({
  __esModule: true,
  default: new Proxy(
    {},
    { get: (t, prop) => ({ id: String(prop), defaultMessage: String(prop) }) }
  )
}));

const intl = { formatMessage: ({ defaultMessage }) => defaultMessage };

const Harness = ({ hookArgs, onResult }) => {
  onResult(useBoardActions(hookArgs));
  return null;
};

const renderActions = hookArgs => {
  let latest;
  act(() => {
    mount(
      <Harness hookArgs={hookArgs} onResult={result => (latest = result)} />
    );
  });
  return () => latest;
};

const baseArgs = overrides => ({
  section: SECTIONS.MY_COMMUNICATOR,
  intl,
  userData: {}, // not logged in -> skips API calls
  language: { lang: 'en-US' },
  communicators: [],
  currentCommunicator: { id: 'c1', boards: ['b1', 'b2'], rootBoard: 'b1' },
  communicatorBoards: [{ id: 'b1' }, { id: 'b2' }],
  availableBoards: [{ id: 'b1' }, { id: 'b2' }],
  createBoard: jest.fn(),
  updateBoard: jest.fn(),
  replaceBoard: jest.fn(),
  addBoards: jest.fn(),
  deleteBoard: jest.fn(),
  deleteApiBoard: jest.fn(),
  updateApiBoard: jest.fn(),
  updateApiObjectsNoChild: jest.fn(),
  addBoardCommunicator: jest.fn(),
  verifyAndUpsertCommunicator: jest.fn(x => x),
  upsertApiCommunicator: jest.fn(),
  showNotification: jest.fn(),
  refetch: jest.fn(),
  removeBoardFromList: jest.fn(),
  replaceBoardInList: jest.fn(),
  ...overrides
});

describe('useBoardActions', () => {
  it('removes a board from the communicator and refetches', async () => {
    const args = baseArgs();
    const get = renderActions(args);

    await act(async () => {
      await get().addOrRemoveBoard({ id: 'b2' });
    });

    expect(args.verifyAndUpsertCommunicator).toHaveBeenCalledWith(
      expect.objectContaining({ boards: ['b1'] })
    );
    expect(args.refetch).toHaveBeenCalled();
  });

  it('toggles membership from the My Boards section', async () => {
    const args = baseArgs({ section: SECTIONS.MY_BOARDS });
    const get = renderActions(args);

    // b3 is not in the communicator and is locally available -> just adds it
    await act(async () => {
      await get().addOrRemoveBoard({ id: 'b1' });
    });

    // b1 was in the communicator -> removed
    expect(args.verifyAndUpsertCommunicator).toHaveBeenCalledWith(
      expect.objectContaining({ boards: ['b2'] })
    );
    expect(args.showNotification).toHaveBeenCalled();
  });

  it('deletes a board and removes it from the visible list', async () => {
    const args = baseArgs({ section: SECTIONS.MY_BOARDS });
    const get = renderActions(args);

    await act(async () => {
      await get().deleteMyBoard({ id: 'b2' });
    });

    expect(args.deleteBoard).toHaveBeenCalledWith('b2');
    expect(args.removeBoardFromList).toHaveBeenCalledWith('b2');
    expect(args.showNotification).toHaveBeenCalled();
  });
});
