import {
  getPendingSyncBoards,
  hasPendingSyncBoards,
  getPendingSyncBoardsCount
} from '../Board.selectors';
import { SYNC_STATUS } from '../Board.constants';

describe('Board selectors', () => {
  const createState = boards => ({
    board: { boards }
  });

  describe('getPendingSyncBoards', () => {
    it('should return boards with syncStatus: PENDING', () => {
      const state = createState([
        { id: '1', syncStatus: SYNC_STATUS.PENDING },
        { id: '2', syncStatus: SYNC_STATUS.SYNCED },
        { id: '3', syncStatus: SYNC_STATUS.PENDING }
      ]);

      const result = getPendingSyncBoards(state);

      expect(result).toHaveLength(2);
      expect(result.map(b => b.id)).toEqual(['1', '3']);
    });

    it('should return empty array when no boards need sync', () => {
      const state = createState([
        { id: '1', syncStatus: SYNC_STATUS.SYNCED },
        { id: '2', syncStatus: SYNC_STATUS.SYNCED }
      ]);

      const result = getPendingSyncBoards(state);

      expect(result).toHaveLength(0);
    });

    it('should treat undefined syncStatus as not pending', () => {
      const state = createState([
        { id: '1' }, // no syncStatus property
        { id: '2', syncStatus: SYNC_STATUS.PENDING }
      ]);

      const result = getPendingSyncBoards(state);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });
  });

  describe('hasPendingSyncBoards', () => {
    it('should return true when at least one board needs sync', () => {
      const state = createState([
        { id: '1', syncStatus: SYNC_STATUS.SYNCED },
        { id: '2', syncStatus: SYNC_STATUS.PENDING }
      ]);

      expect(hasPendingSyncBoards(state)).toBe(true);
    });

    it('should return false when no boards need sync', () => {
      const state = createState([
        { id: '1', syncStatus: SYNC_STATUS.SYNCED },
        { id: '2', syncStatus: SYNC_STATUS.SYNCED }
      ]);

      expect(hasPendingSyncBoards(state)).toBe(false);
    });

    it('should return false for empty boards array', () => {
      const state = createState([]);

      expect(hasPendingSyncBoards(state)).toBe(false);
    });
  });

  describe('getPendingSyncBoardsCount', () => {
    it('should return count of boards needing sync', () => {
      const state = createState([
        { id: '1', syncStatus: SYNC_STATUS.PENDING },
        { id: '2', syncStatus: SYNC_STATUS.SYNCED },
        { id: '3', syncStatus: SYNC_STATUS.PENDING },
        { id: '4', syncStatus: SYNC_STATUS.PENDING }
      ]);

      expect(getPendingSyncBoardsCount(state)).toBe(3);
    });

    it('should return 0 when no boards need sync', () => {
      const state = createState([{ id: '1', syncStatus: SYNC_STATUS.SYNCED }]);

      expect(getPendingSyncBoardsCount(state)).toBe(0);
    });
  });
});
