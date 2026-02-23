import { SYNC_STATUS } from './Board.constants';

/**
 * Get all boards that need to be synced with the server
 * @param {Object} state - Redux state
 * @returns {Array} Boards with syncStatus: PENDING
 */
export const getPendingSyncBoards = state =>
  state.board.boards.filter(board => board.syncStatus === SYNC_STATUS.PENDING);

/**
 * Check if there are any boards pending sync
 * @param {Object} state - Redux state
 * @returns {boolean} True if any board needs sync
 */
export const hasPendingSyncBoards = state =>
  state.board.boards.some(board => board.syncStatus === SYNC_STATUS.PENDING);

/**
 * Get count of boards pending sync
 * @param {Object} state - Redux state
 * @returns {number} Number of boards needing sync
 */
export const getPendingSyncBoardsCount = state =>
  state.board.boards.filter(board => board.syncStatus === SYNC_STATUS.PENDING)
    .length;
