import { SYNC_STATUS } from './Board.constants';

/**
 * Get all boards that need to be synced with the server
 * @param {Object} state - Redux state
 * @returns {Array} Boards with syncMeta status: PENDING
 */
export const getPendingSyncBoards = state =>
  state.board.boards.filter(
    b => state.board.syncMeta[b.id]?.status === SYNC_STATUS.PENDING
  );

/**
 * Check if there are any boards pending sync
 * @param {Object} state - Redux state
 * @returns {boolean} True if any board needs sync
 */
export const hasPendingSyncBoards = state =>
  Object.values(state.board.syncMeta).some(
    m => m.status === SYNC_STATUS.PENDING
  );

/**
 * Get count of boards pending sync
 * @param {Object} state - Redux state
 * @returns {number} Number of boards needing sync
 */
export const getPendingSyncBoardsCount = state =>
  Object.values(state.board.syncMeta).filter(
    m => m.status === SYNC_STATUS.PENDING
  ).length;

/**
 * Get IDs of boards that are marked as deleted
 * @param {Object} state - Redux state
 * @returns {Array} Board IDs marked as deleted
 */
export const getDeletedBoardIds = state =>
  Object.entries(state.board.syncMeta)
    .filter(([, m]) => m.isDeleted)
    .map(([id]) => id);
