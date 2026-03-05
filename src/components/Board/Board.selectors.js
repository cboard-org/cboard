import { createSelector } from 'reselect';
import { SYNC_STATUS } from './Board.constants';

const getBoards = state => state.board.boards;
const getSyncMeta = state => state.board.syncMeta ?? {};

/**
 * Get all boards that need to be synced with the server
 * @param {Object} state - Redux state
 * @returns {Array} Boards with syncMeta status: PENDING
 */
export const getPendingSyncBoards = createSelector(
  [getBoards, getSyncMeta],
  (boards, syncMeta) =>
    boards.filter(b => syncMeta[b.id]?.status === SYNC_STATUS.PENDING)
);

/**
 * Check if there are any boards pending sync
 * @param {Object} state - Redux state
 * @returns {boolean} True if any board needs sync
 */
export const hasPendingSyncBoards = createSelector(
  [getSyncMeta],
  syncMeta =>
    Object.values(syncMeta).some(m => m.status === SYNC_STATUS.PENDING)
);

/**
 * Get count of boards pending sync
 * @param {Object} state - Redux state
 * @returns {number} Number of boards needing sync
 */
export const getPendingSyncBoardsCount = createSelector(
  [getSyncMeta],
  syncMeta =>
    Object.values(syncMeta).filter(m => m.status === SYNC_STATUS.PENDING).length
);

/**
 * Get IDs of boards that are marked as deleted
 * @param {Object} state - Redux state
 * @returns {Array} Board IDs marked as deleted
 */
export const getDeletedBoardIds = createSelector(
  [getSyncMeta],
  syncMeta =>
    Object.entries(syncMeta)
      .filter(([, m]) => m.isDeleted)
      .map(([id]) => id)
);

/**
 * Get all boards that are not soft-deleted.
 * DELETE_BOARD keeps the board in state.boards (for queued deletion at sync time)
 * but marks syncMeta[id].isDeleted = true. This selector filters them for UI use.
 * @param {Object} state - Redux state
 * @returns {Array} Boards not marked as deleted
 */
export const getVisibleBoards = createSelector(
  [getBoards, getSyncMeta],
  (boards, syncMeta) => boards.filter(b => !syncMeta[b.id]?.isDeleted)
);
