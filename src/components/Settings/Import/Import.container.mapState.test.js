import { mapStateToProps } from './Import.container';
import { SYNC_STATUS } from '../../Board/Board.constants';

const createState = (boards, syncMeta = {}) => ({
  board: { boards, syncMeta },
  communicator: {
    activeCommunicatorId: 'comm-1',
    communicators: [{ id: 'comm-1' }]
  },
  app: { userData: null }
});

describe('Import.container mapStateToProps', () => {
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
});
