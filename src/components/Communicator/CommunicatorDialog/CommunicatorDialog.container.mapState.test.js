import { mapStateToProps } from './CommunicatorDialog.container';
import { SYNC_STATUS } from '../../Board/Board.constants';

const createState = (boards, syncMeta = {}) => ({
  board: {
    boards,
    syncMeta,
    activeBoardId: null
  },
  communicator: {
    activeCommunicatorId: 'comm-1',
    communicators: [{ id: 'comm-1', boards: boards.map(b => b.id) }]
  },
  language: { lang: 'en-US' },
  app: {
    userData: null,
    displaySettings: {},
    liveHelp: {
      communicatorTour: null,
      isSymbolSearchTourEnabled: false
    }
  }
});

describe('CommunicatorDialog.container mapStateToProps', () => {
  describe('availableBoards prop', () => {
    it('returns all boards when none are soft-deleted', () => {
      const boards = [{ id: 'board-1' }, { id: 'board-2' }];
      const state = createState(boards);

      const props = mapStateToProps(state, {});

      expect(props.availableBoards).toHaveLength(2);
    });

    it('excludes soft-deleted boards', () => {
      const boards = [{ id: 'board-1' }, { id: 'board-2' }];
      const syncMeta = {
        'board-2': { status: SYNC_STATUS.PENDING, isDeleted: true }
      };
      const state = createState(boards, syncMeta);

      const props = mapStateToProps(state, {});

      expect(props.availableBoards).toHaveLength(1);
      expect(props.availableBoards[0].id).toBe('board-1');
    });
  });

  describe('communicatorBoards prop', () => {
    it('excludes soft-deleted boards from communicator board list', () => {
      const boards = [{ id: 'board-1' }, { id: 'board-2' }];
      const syncMeta = {
        'board-2': { status: SYNC_STATUS.PENDING, isDeleted: true }
      };
      const state = createState(boards, syncMeta);

      const props = mapStateToProps(state, {});

      expect(props.communicatorBoards).toHaveLength(1);
      expect(props.communicatorBoards[0].id).toBe('board-1');
    });
  });
});
