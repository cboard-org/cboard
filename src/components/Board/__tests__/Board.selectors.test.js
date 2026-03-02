import {
  getPendingSyncBoards,
  hasPendingSyncBoards,
  getPendingSyncBoardsCount,
  getDeletedBoardIds
} from '../Board.selectors';
import { SYNC_STATUS } from '../Board.constants';

describe('Board selectors', () => {
  const createState = (boards, syncMeta = {}) => ({
    board: { boards, syncMeta }
  });

  describe('getPendingSyncBoards', () => {
    it('should return boards with syncMeta status PENDING', () => {
      const state = createState([{ id: '1' }, { id: '2' }, { id: '3' }], {
        '1': { status: SYNC_STATUS.PENDING },
        '2': { status: SYNC_STATUS.SYNCED },
        '3': { status: SYNC_STATUS.PENDING }
      });

      const result = getPendingSyncBoards(state);

      expect(result).toHaveLength(2);
      expect(result.map(b => b.id)).toEqual(['1', '3']);
    });

    it('should return empty array when no boards need sync', () => {
      const state = createState([{ id: '1' }, { id: '2' }], {
        '1': { status: SYNC_STATUS.SYNCED },
        '2': { status: SYNC_STATUS.SYNCED }
      });

      const result = getPendingSyncBoards(state);

      expect(result).toHaveLength(0);
    });

    it('should treat boards without syncMeta entry as not pending', () => {
      const state = createState([{ id: '1' }, { id: '2' }], {
        '2': { status: SYNC_STATUS.PENDING }
      });

      const result = getPendingSyncBoards(state);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });
  });

  describe('hasPendingSyncBoards', () => {
    it('should return true when at least one board needs sync', () => {
      const state = createState([{ id: '1' }, { id: '2' }], {
        '1': { status: SYNC_STATUS.SYNCED },
        '2': { status: SYNC_STATUS.PENDING }
      });

      expect(hasPendingSyncBoards(state)).toBe(true);
    });

    it('should return false when no boards need sync', () => {
      const state = createState([{ id: '1' }, { id: '2' }], {
        '1': { status: SYNC_STATUS.SYNCED },
        '2': { status: SYNC_STATUS.SYNCED }
      });

      expect(hasPendingSyncBoards(state)).toBe(false);
    });

    it('should return false for empty boards array', () => {
      const state = createState([]);

      expect(hasPendingSyncBoards(state)).toBe(false);
    });
  });

  describe('getPendingSyncBoardsCount', () => {
    it('should return count of boards needing sync', () => {
      const state = createState(
        [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
        {
          '1': { status: SYNC_STATUS.PENDING },
          '2': { status: SYNC_STATUS.SYNCED },
          '3': { status: SYNC_STATUS.PENDING },
          '4': { status: SYNC_STATUS.PENDING }
        }
      );

      expect(getPendingSyncBoardsCount(state)).toBe(3);
    });

    it('should return 0 when no boards need sync', () => {
      const state = createState([{ id: '1' }], {
        '1': { status: SYNC_STATUS.SYNCED }
      });

      expect(getPendingSyncBoardsCount(state)).toBe(0);
    });
  });

  describe('getDeletedBoardIds', () => {
    it('should return IDs of boards marked as deleted in syncMeta', () => {
      const state = createState([{ id: '1' }, { id: '2' }, { id: '3' }], {
        '1': { status: SYNC_STATUS.PENDING, isDeleted: true },
        '2': { status: SYNC_STATUS.SYNCED, isDeleted: false },
        '3': { status: SYNC_STATUS.PENDING, isDeleted: true }
      });

      const result = getDeletedBoardIds(state);

      expect(result).toHaveLength(2);
      expect(result).toContain('1');
      expect(result).toContain('3');
    });

    it('should return empty array when no boards are deleted', () => {
      const state = createState([{ id: '1' }], {
        '1': { status: SYNC_STATUS.SYNCED }
      });

      expect(getDeletedBoardIds(state)).toHaveLength(0);
    });
  });
});
