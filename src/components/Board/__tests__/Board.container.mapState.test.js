import { mapStateToProps } from '../Board.container';
import { SYNC_STATUS } from '../Board.constants';

jest.mock('ogv', () => ({ OGVLoader: { base: '' } }));
jest.mock('dom-to-image', () => ({}));
jest.mock('../Board.component', () => () => null);

const createState = (boards, syncMeta = {}) => ({
  board: {
    boards,
    syncMeta,
    activeBoardId: null,
    output: [],
    navHistory: [],
    isLiveMode: false,
    improvedPhrase: null
  },
  communicator: {
    activeCommunicatorId: 'comm-1',
    communicators: [{ id: 'comm-1', boards: boards.map(b => b.id) }]
  },
  speech: {
    voices: [],
    options: { voiceURI: null, isCloud: false }
  },
  scanner: {},
  app: {
    displaySettings: {},
    navigationSettings: {},
    userData: null,
    isConnected: true,
    liveHelp: {
      isRootBoardTourEnabled: false,
      isSymbolSearchTourEnabled: false,
      isUnlockedTourEnabled: false
    }
  },
  language: { lang: 'en-US' },
  subscription: {
    premiumRequiredModalState: null,
    isInFreeCountry: true,
    isSubscribed: false,
    isOnTrialPeriod: false
  }
});

describe('Board.container mapStateToProps', () => {
  describe('boards prop', () => {
    it('returns all boards when none are soft-deleted', () => {
      const boards = [{ id: 'board-1' }, { id: 'board-2' }];
      const state = createState(boards);

      const props = mapStateToProps(state);

      expect(props.boards).toHaveLength(2);
    });

    it('excludes soft-deleted boards', () => {
      const boards = [{ id: 'board-1' }, { id: 'board-2' }];
      const syncMeta = {
        'board-2': { status: SYNC_STATUS.PENDING, isDeleted: true }
      };
      const state = createState(boards, syncMeta);

      const props = mapStateToProps(state);

      expect(props.boards).toHaveLength(1);
      expect(props.boards[0].id).toBe('board-1');
    });
  });

  describe('board prop (active board)', () => {
    it('returns undefined for active board that is soft-deleted', () => {
      const boards = [{ id: 'board-1' }, { id: 'board-2' }];
      const syncMeta = {
        'board-2': { status: SYNC_STATUS.PENDING, isDeleted: true }
      };
      const state = {
        ...createState(boards, syncMeta),
        board: {
          ...createState(boards, syncMeta).board,
          activeBoardId: 'board-2'
        }
      };

      const props = mapStateToProps(state);

      expect(props.board).toBeUndefined();
    });
  });
});
