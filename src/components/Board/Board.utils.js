import moment from 'moment';
import { SHORT_ID_MAX_LENGTH, DEFAULT_BOARD_EMAIL } from './Board.constants';
import { DEFAULT_BOARDS } from '../../helpers';

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
const DEFAULT_BOARD_IDS = new Set(
  [...DEFAULT_BOARDS.advanced, ...DEFAULT_BOARDS.picSeePal].map(b => b.id)
);

/**
 * Returns true if the board is a known default board (shipped with the app)
 * that still belongs to the default email.
 */
export const isDefaultBoard = board =>
  DEFAULT_BOARD_IDS.has(board.id) && board.email === DEFAULT_BOARD_EMAIL;

export const isLocalBoard = board => board.id.length < SHORT_ID_MAX_LENGTH;
export const isServerBoard = board => board.id.length >= SHORT_ID_MAX_LENGTH;

/**
 * Returns true if `board` has a folder tile whose `loadBoard` points to a board
 * that is still local and is not a shipped default board.
 * @param {Object} board    The board whose tiles are checked.
 * @param {Object[]} boards The full local board list (to resolve loadBoard ids).
 * @returns {boolean}
 */
export const hasUnsyncedChildReference = (board, boards = []) => {
  if (!board || !Array.isArray(board.tiles)) return false;
  const unsyncedLocalIds = new Set(
    boards
      .filter(b => b && isLocalBoard(b) && !isDefaultBoard(b))
      .map(b => b.id)
  );
  if (unsyncedLocalIds.size === 0) return false;
  return board.tiles.some(
    tile => tile && tile.loadBoard && unsyncedLocalIds.has(tile.loadBoard)
  );
};

export const hasDefaultOrNoEmail = board =>
  !board.email || board.email === DEFAULT_BOARD_EMAIL;

export const isUnloggedCreatedBoard = board =>
  !isDefaultBoard(board) && hasDefaultOrNoEmail(board);

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
 * Used when syncing default boards (DEFAULT_BOARD_EMAIL) or offline-created boards.
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
 * @returns {{ boardsToAdd, boardsToUpdate, boardIdsToVerify }}
 */
export function classifyRemoteBoards(localBoards, remoteBoards, syncMeta = {}) {
  const boardsToAdd = [];
  const boardsToUpdate = [];
  const boardIdsToVerify = [];

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

  // Identify candidates for server-side deletion. Absence from the manifest is
  // not trusted on its own: each candidate must be confirmed deleted by the
  // server (absent from a fresh by-ids read) before it is removed locally.
  for (const local of localBoards) {
    const hasServerId = isServerBoard(local);
    const notInRemote = !remoteBoardIds.has(local.id);
    const notLocallyDeleted = !syncMeta[local.id]?.isDeleted;
    const localHasSyncStatus = syncMeta[local.id] != null;

    if (hasServerId && notInRemote && notLocallyDeleted && localHasSyncStatus) {
      boardIdsToVerify.push(local.id);
    }
  }

  return {
    boardsToAdd,
    boardsToUpdate,
    boardIdsToVerify
  };
}
