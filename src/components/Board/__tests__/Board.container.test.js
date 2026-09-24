import { mapStateToProps, BoardContainer } from '../Board.container';
import { SYNC_STATUS } from '../Board.constants';

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
    communicators: [{ id: 'comm-1', boards: boards.map((b) => b.id) }]
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
    const buildInstance = (props) => {
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

  describe('UNSAFE_componentWillReceiveProps (browser back detection)', () => {
    const boards = [{ id: 'root' }, { id: 'food' }, { id: 'soup' }];

    const buildInstance = (props) => {
      const instance = new BoardContainer({
        boards,
        navHistory: ['root', 'food', 'soup'],
        board: { id: 'soup' },
        match: { params: { id: 'soup' } },
        changeBoard: jest.fn(),
        previousBoard: jest.fn(),
        historyRemoveBoard: jest.fn(),
        ...props
      });
      instance.scrollToTop = jest.fn();
      return instance;
    };

    const nextPropsFor = (instance, { urlId, activeId, navHistory }) => ({
      ...instance.props,
      match: { params: { id: urlId } },
      board: activeId ? { id: activeId } : undefined,
      navHistory: navHistory || instance.props.navHistory
    });

    it('does not pop again when the in-app back arrow already moved Redux to the previous board', () => {
      const instance = buildInstance();

      instance.UNSAFE_componentWillReceiveProps(
        nextPropsFor(instance, {
          urlId: 'food',
          activeId: 'food',
          navHistory: ['root', 'food']
        })
      );

      expect(instance.props.previousBoard).not.toHaveBeenCalled();
      expect(instance.props.changeBoard).not.toHaveBeenCalled();
    });

    it('pops once on a browser back to the previous board', () => {
      const instance = buildInstance();

      instance.UNSAFE_componentWillReceiveProps(
        nextPropsFor(instance, { urlId: 'food', activeId: 'soup' })
      );

      expect(instance.props.changeBoard).toHaveBeenCalledWith('food');
      expect(instance.props.previousBoard).toHaveBeenCalledTimes(1);
    });

    it('does not treat a folder click forward as a back action', () => {
      const instance = buildInstance({
        navHistory: ['root', 'food'],
        board: { id: 'food' },
        match: { params: { id: 'food' } }
      });

      instance.UNSAFE_componentWillReceiveProps(
        nextPropsFor(instance, {
          urlId: 'soup',
          activeId: 'soup',
          navHistory: ['root', 'food', 'soup']
        })
      );

      expect(instance.props.previousBoard).not.toHaveBeenCalled();
      expect(instance.props.changeBoard).not.toHaveBeenCalled();
    });

    it('removes a missing board from history on a browser back', () => {
      const instance = buildInstance({
        boards: [{ id: 'root' }, { id: 'soup' }]
      });

      instance.UNSAFE_componentWillReceiveProps(
        nextPropsFor(instance, { urlId: 'food', activeId: 'soup' })
      );

      expect(instance.props.historyRemoveBoard).toHaveBeenCalledWith('food');
      expect(instance.props.previousBoard).not.toHaveBeenCalled();
    });
  });
});
