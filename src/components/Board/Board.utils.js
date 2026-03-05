import moment from 'moment';
import { SHORT_ID_MAX_LENGTH } from './Board.constants';

/**
 * Returns true if the board was created locally (not yet synced to server).
 * Uses an ID-length heuristic: IDs shorter than SHORT_ID_MAX_LENGTH characters
 * are assumed to be locally-generated shortids; longer IDs are assumed to be
 * server-assigned MongoDB ObjectIds.
 *
 * Limitation: this heuristic can theoretically misclassify a locally-generated
 * ID that happens to be >= SHORT_ID_MAX_LENGTH chars, but shortid output is
 * typically 7-12 chars so this is safe in practice.
 */
export const isLocalBoard = board => board.id.length < SHORT_ID_MAX_LENGTH;
export const isServerBoard = board => board.id.length >= SHORT_ID_MAX_LENGTH;

/**
 * Extract board name from board object.
 * Falls back to parsing nameKey if name is not set.
 * @param {Object} board - Board object
 * @returns {string} Board name
 */
const extractBoardName = board => {
  if (board.name) return board.name;
  if (board.nameKey) {
    const splitNameKeyParts = board.nameKey.split('.');
    const NAMEKEY_LAST_INDEX = splitNameKeyParts.length - 1;
    return splitNameKeyParts[NAMEKEY_LAST_INDEX];
  }
  return '';
};

/**
 * Transform a board to belong to the current user.
 * Used when syncing default boards (support@cboard.io) or offline-created boards.
 * @param {Object} board - Board object to transform
 * @param {string} userEmail - User's email address
 * @param {string} userName - User's display name
 * @param {string} locale - User's locale/language code
 * @returns {Object} Transformed board object
 */
export const transformBoardForUser = (board, userEmail, userName, locale) => ({
  ...board,
  email: userEmail,
  author: userName || userEmail,
  name: extractBoardName(board),
  isPublic: false,
  locale: locale,
  hidden: false
});

/**
 * Classify remote boards for PULL operation.
 * Identifies boards that are new from the server or have newer versions on the server.
 * @param {Array} localBoards - Boards from local state
 * @param {Array} remoteBoards - Boards from the server
 * @param {Object} syncMeta - Current syncMeta map
 * @returns {{ boardsToAdd, boardsToUpdate, boardIdsToDelete }}
 */
export function classifyRemoteBoards(localBoards, remoteBoards, syncMeta = {}) {
  const boardsToAdd = [];
  const boardsToUpdate = [];
  const boardIdsToDelete = [];

  const remoteBoardIds = new Set(remoteBoards.map(b => b.id));
  const localBoardMap = new Map(localBoards.map(b => [b.id, b]));

  for (const remote of remoteBoards) {
    const local = localBoardMap.get(remote.id);

    if (!local) {
      boardsToAdd.push(remote);
      continue;
    }

    if (moment(remote.lastEdited).isAfter(local.lastEdited)) {
      boardsToUpdate.push(remote);
    }
  }

  // Identify boards deleted on server
  for (const local of localBoards) {
    const hasServerId = isServerBoard(local);
    const notInRemote = !remoteBoardIds.has(local.id);
    const notLocallyDeleted = !syncMeta[local.id]?.isDeleted;
    const localHasSyncStatus = syncMeta[local.id] != null;

    if (hasServerId && notInRemote && notLocallyDeleted && localHasSyncStatus) {
      boardIdsToDelete.push(local.id);
    }
  }

  return {
    boardsToAdd,
    boardsToUpdate,
    boardIdsToDelete
  };
}
