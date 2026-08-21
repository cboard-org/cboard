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
    updateBoard: jest.fn(),
    uploadBoardLocalMedia: jest.fn()
  }
}));

jest.mock('../CommunicatorDialog.messages', () => ({
  __esModule: true,
  default: new Proxy(
    {},
    { get: (t, prop) => ({ id: String(prop), defaultMessage: String(prop) }) }
  )
}));

jest.mock('../../../Settings/Export/Export.helpers', () => ({
  __esModule: true,
  openboardExportOneAdapter: jest.fn(() => Promise.resolve()),
  pdfExportAdapter: jest.fn(() => Promise.resolve())
}));

jest.mock('../../../../history', () => ({
  __esModule: true,
  default: { replace: jest.fn() }
}));

const intl = { formatMessage: ({ defaultMessage }) => defaultMessage };

const Harness = ({ hookArgs, onResult }) => {
  onResult(useBoardActions(hookArgs));
  return null;
};

const renderActions = (hookArgs) => {
  let latest;
  act(() => {
    mount(
      <Harness hookArgs={hookArgs} onResult={(result) => (latest = result)} />
    );
  });
  return () => latest;
};

const baseArgs = (overrides) => ({
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
  verifyAndUpsertCommunicator: jest.fn((x) => x),
  upsertApiCommunicator: jest.fn(),
  showNotification: jest.fn(),
  refetch: jest.fn(),
  removeBoardFromList: jest.fn(),
  replaceBoardInList: jest.fn(),
  switchBoard: jest.fn(),
  onClose: jest.fn(),
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

  it('reorders the communicator ids without dropping hidden ones', async () => {
    const args = baseArgs({
      section: SECTIONS.MY_COMMUNICATOR,
      currentCommunicator: {
        id: 'c1',
        boards: ['b1', 'hidden', 'b2'],
        rootBoard: 'b1'
      }
    });
    const get = renderActions(args);

    await act(async () => {
      await get().reorderCommunicatorBoards('b1', 1, ['b1', 'b2']);
    });

    expect(args.verifyAndUpsertCommunicator).toHaveBeenCalledWith(
      expect.objectContaining({ boards: ['b2', 'hidden', 'b1'] })
    );
  });

  it('does not persist a move that is already at the end', async () => {
    const args = baseArgs({ section: SECTIONS.MY_COMMUNICATOR });
    const get = renderActions(args);

    await act(async () => {
      await get().reorderCommunicatorBoards('b2', 1, ['b1', 'b2']);
    });

    expect(args.verifyAndUpsertCommunicator).not.toHaveBeenCalled();
  });

  it('exports a single board and notifies on success', async () => {
    const {
      openboardExportOneAdapter
    } = require('../../../Settings/Export/Export.helpers');
    const args = baseArgs({ section: SECTIONS.MY_BOARDS });
    const get = renderActions(args);
    const board = { id: 'b2', name: 'Comidas' };

    await act(async () => {
      await get().exportBoard(board);
    });

    expect(openboardExportOneAdapter).toHaveBeenCalledWith(board, args.intl);
    expect(args.showNotification).toHaveBeenCalled();
  });

  it('notifies when an export fails', async () => {
    const {
      openboardExportOneAdapter
    } = require('../../../Settings/Export/Export.helpers');
    openboardExportOneAdapter.mockRejectedValueOnce(new Error('boom'));
    const args = baseArgs({ section: SECTIONS.MY_BOARDS });
    const get = renderActions(args);

    await act(async () => {
      await get().exportBoard({ id: 'b2', name: 'Comidas' });
    });

    expect(args.showNotification).toHaveBeenCalled();
  });

  it('exports a board as PDF wrapped in an array', async () => {
    const {
      pdfExportAdapter
    } = require('../../../Settings/Export/Export.helpers');
    const args = baseArgs({ section: SECTIONS.MY_BOARDS });
    const get = renderActions(args);
    const board = { id: 'b2', name: 'Comidas' };

    await act(async () => {
      await get().exportBoardToPdf(board);
    });

    expect(pdfExportAdapter).toHaveBeenCalledWith(
      [board],
      expect.anything(),
      args.intl
    );
  });

  it('switches to a board, navigates and closes the dialog', async () => {
    const history = require('../../../../history').default;
    const args = baseArgs({ section: SECTIONS.MY_BOARDS });
    const get = renderActions(args);

    await act(async () => {
      await get().showBoard({ id: 'b2' });
    });

    expect(args.switchBoard).toHaveBeenCalledWith('b2');
    expect(history.replace).toHaveBeenCalledWith('/board/b2');
    expect(args.onClose).toHaveBeenCalled();
  });

  it('uploads local media before sending the published board', async () => {
    const API = require('../../../../api').default;
    const board = {
      id: 'b2',
      name: 'Comidas',
      isPublic: false,
      tiles: [{ id: 't1', image: 'data:image/png;base64,AAA' }]
    };
    const sanitized = {
      ...board,
      isPublic: true,
      tiles: [{ id: 't1', image: 'https://cdn.cboard.io/t1.png' }]
    };
    const persisted = { ...sanitized, _id: 'srv1' };
    API.uploadBoardLocalMedia.mockResolvedValueOnce({
      board: sanitized,
      hadFailure: false
    });
    API.updateBoard.mockResolvedValueOnce(persisted);

    const args = baseArgs({
      section: SECTIONS.MY_BOARDS,
      userData: { name: 'Tester', email: 'tester@cboard.io' }
    });
    const get = renderActions(args);

    await act(async () => {
      await get().publishBoard(board);
    });

    expect(API.uploadBoardLocalMedia).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'b2', isPublic: true })
    );
    expect(API.updateBoard).toHaveBeenCalledWith(sanitized);
    expect(args.replaceBoardInList).toHaveBeenLastCalledWith(persisted);
  });
});
