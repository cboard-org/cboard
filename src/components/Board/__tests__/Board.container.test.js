import { mapStateToProps, BoardContainer } from '../Board.container';
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

describe('Board.container', () => {
  describe('mapStateToProps', () => {
    describe('active board handling', () => {
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

      // Note: Basic getVisibleBoards() filtering logic is tested in Board.selectors.test.js
      // This test covers the container-specific behavior: board: getVisibleBoards(state).find(board => board.id === activeBoardId)
    });

    it('maps unauthEditModalDismissed from the app state', () => {
      const boards = [{ id: 'board-1' }];
      const base = createState(boards);
      const state = {
        ...base,
        app: { ...base.app, unauthEditModalDismissed: true }
      };

      const props = mapStateToProps(state);

      expect(props.unauthEditModalDismissed).toBe(true);
    });
  });

  describe('handleLockClick (unauthenticated edit modal gating)', () => {
    const buildInstance = props => {
      const instance = new BoardContainer({
        showPremiumRequired: jest.fn(),
        isSubscriptionRequired: false,
        setIsSaving: jest.fn(),
        navigationSettings: {},
        isLogged: false,
        unauthEditModalDismissed: false,
        ...props
      });
      instance.state = { ...instance.state, isLocked: true };
      instance.setState = jest.fn();
      return instance;
    };

    it('opens the modal when logged out and it has not been dismissed', () => {
      const instance = buildInstance({
        isLogged: false,
        unauthEditModalDismissed: false
      });

      instance.handleLockClick();

      expect(instance.setState).toHaveBeenCalledWith({
        showUnauthEditModal: true
      });
    });

    it('unlocks directly when logged out but already dismissed', () => {
      const instance = buildInstance({
        isLogged: false,
        unauthEditModalDismissed: true
      });

      instance.handleLockClick();

      // Should not open the modal...
      expect(instance.setState).not.toHaveBeenCalledWith({
        showUnauthEditModal: true
      });
      // ...but go straight to the unlock updater (a function argument).
      expect(typeof instance.setState.mock.calls[0][0]).toBe('function');
    });
  });
});
