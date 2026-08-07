import { mapStateToProps } from './CommunicatorToolbar.container';

const createState = ({ boards, communicatorBoards }) => ({
  board: {
    boards,
    syncMeta: {},
    activeBoardId: 'b1'
  },
  communicator: {
    activeCommunicatorId: 'comm-1',
    communicators: [
      { id: 'comm-1', boards: communicatorBoards, rootBoard: 'b1' }
    ]
  },
  app: {
    userData: null,
    displaySettings: { darkThemeActive: false }
  }
});

describe('CommunicatorToolbar.container mapStateToProps', () => {
  it('renders boards in communicator order, not in availableBoards order', () => {
    const state = createState({
      boards: [{ id: 'b1' }, { id: 'b2' }, { id: 'b3' }],
      communicatorBoards: ['b3', 'b1', 'b2']
    });

    const props = mapStateToProps(state, {});

    expect(props.boards.map(b => b.id)).toEqual(['b3', 'b1', 'b2']);
  });

  it('skips communicator ids that have no visible board', () => {
    const state = createState({
      boards: [{ id: 'b1' }, { id: 'b3' }],
      communicatorBoards: ['b3', 'missing', 'b1']
    });

    const props = mapStateToProps(state, {});

    expect(props.boards.map(b => b.id)).toEqual(['b3', 'b1']);
  });
});
