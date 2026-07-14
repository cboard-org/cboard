import {
  IS_BROWSING_FROM_APPLE_TOUCH,
  IS_BROWSING_FROM_SAFARI
} from '../../constants';
import moment from 'moment';
import { SHORT_ID_MAX_LENGTH, DEFAULT_BOARD_EMAIL } from './Board.constants';
import { DEFAULT_BOARDS } from '../../helpers';
import messages from './Board.messages';
import {
  SCANNING_METHOD_MANUAL,
  SCANNING_METHOD_AUTOMATIC
} from '../Settings/Scanning/Scanning.constants';

const ogv = require('ogv');
ogv.OGVLoader.base = process.env.PUBLIC_URL + '/ogv';

/**
 * Plays audio for a tile with OGV fallback for Safari/iOS.
 * Extracted from Board.container.js playAudio method.
 * @param {string} src - Audio file URL
 */
export const playTileAudio = async src => {
  const safariNeedHelp =
    (IS_BROWSING_FROM_SAFARI || IS_BROWSING_FROM_APPLE_TOUCH) &&
    src.endsWith('.ogg');
  const audio = safariNeedHelp ? new ogv.OGVPlayer() : new Audio();
  audio.src = src;
  await audio.play();
};

/**
 * Vocalizes a tile: plays its sound file or speaks its label via TTS.
 * @param {Object} tile - The tile to vocalize
 * @param {Function} speak - TTS speak function from SpeechProvider
 * @param {Object} [options]
 * @param {boolean} [options.hasAction] - Whether the tile has a '+' action
 */
export const vocalizeTile = (tile, speak, options = {}) => {
  const { hasAction = false } = options;

  if (tile.sound) {
    playTileAudio(tile.sound);
  } else {
    const toSpeak = !hasAction ? tile.vocalization || tile.label : null;
    if (toSpeak && speak) {
      speak(toSpeak);
    }
  }
};

/**
 * Finds the next board to navigate to based on a folder tile.
 * Tries by loadBoard id first, then falls back to matching by label/name.
 * @param {Object} tile - Folder tile with loadBoard property
 * @param {Array} boards - Available boards list
 * @returns {Object|null} The matching board, or null if not found
 */
export const findNextBoard = (tile, boards) => {
  return (
    boards.find(b => b.id === tile.loadBoard) ||
    boards.find(b => b.name === tile.label) ||
    null
  );
};

/**
 * Creates a live mode tile marker appended after the spoken symbol.
 * @param {Function} generateId - Function that returns a unique id string
 * @returns {Object} Live tile object with a unique id
 */
export const createLiveTile = generateId => ({
  backgroundColor: 'rgb(255, 241, 118)',
  id: generateId(),
  image: '',
  label: '',
  labelKey: '',
  type: 'live'
});

/**
 * Core tile click logic shared between Board.container and AccessViewer.
 * Handles folder navigation and symbol output, delegating side effects via callbacks.
 * @param {Object} params
 * @param {Object} params.tile - The clicked tile (with resolved label)
 * @param {Array} params.boards - Available boards
 * @param {Array} params.output - Current output array
 * @param {Object} [params.navigationSettings] - Navigation settings
 * @param {Function} params.speak - TTS speak function
 * @param {Function} params.changeBoard - Callback to change active board
 * @param {Function} params.changeOutput - Callback to update output
 * @param {Function} [params.clickSymbol] - Analytics/click tracking callback
 * @param {boolean} [params.isLiveMode] - Whether live mode is active
 * @param {Function} [params.generateId] - Function that returns a unique id (required when isLiveMode is true)
 * @param {Function} [params.onNavigate] - Called after successful board navigation
 * @param {Function} [params.onBoardNotFound] - Called when loadBoard target not found
 * @returns {{ navigated: boolean, nextBoardId?: string }}
 */
export const processTileClick = ({
  tile,
  boards,
  output,
  navigationSettings = {},
  speak,
  changeBoard,
  changeOutput,
  clickSymbol,
  isLiveMode,
  generateId,
  onNavigate,
  onBoardNotFound
}) => {
  const hasAction = tile.action && tile.action.startsWith('+');

  if (tile.loadBoard) {
    const nextBoard = findNextBoard(tile, boards);

    if (nextBoard) {
      if (changeBoard) changeBoard(nextBoard.id);

      if (onNavigate) onNavigate(nextBoard.id);

      if (navigationSettings.vocalizeFolders) {
        vocalizeTile(tile, speak, { hasAction });
      }

      return { navigated: true, nextBoardId: nextBoard.id };
    } else {
      if (onBoardNotFound) onBoardNotFound(tile);
      return { navigated: false };
    }
  }

  if (clickSymbol) clickSymbol(tile.label);

  if (!navigationSettings.quietBuilderMode) {
    vocalizeTile(tile, speak, { hasAction });
  }

  const newOutput = isLiveMode
    ? [...output, tile, createLiveTile(generateId)]
    : [...output, tile];

  if (changeOutput) changeOutput(newOutput);

  return { navigated: false };
};

/**
 * Returns message descriptors for scanner strategy notifications.
 * Receives all platform/env inputs as params to keep the function pure and testable.
 * @param {string} strategy - Scanner strategy (manual/automatic)
 * @param {boolean} isAnyMobile - Whether the current device is a mobile device
 * @returns {{ strategyMessage: Object|null, deactivateMessage: Object, showDeactivate: boolean }}
 */
export const getScannerStrategyNotificationMessages = (
  strategy,
  isAnyMobile = false
) => {
  const messagesKeyMap = {
    [SCANNING_METHOD_MANUAL]: messages.scannerManualStrategy,
    [SCANNING_METHOD_AUTOMATIC]: messages.scannerAutomaticStrategy
  };
  return {
    strategyMessage: messagesKeyMap[strategy] || null,
    deactivateMessage: messages.scannerHowToDeactivate,
    showDeactivate: !isAnyMobile
  };
};

/**
 * Scrolls the board container to the top.
 * Extracted from Board.container.js scrollToTop method.
 * @param {Object} boardRef - React ref to the Board component
 * @param {boolean} [isFixed] - Whether the board uses the fixed layout
 */
export const scrollBoardToTop = (boardRef, isFixed = false) => {
  if (boardRef?.current) {
    const containerRef = isFixed
      ? 'fixedBoardContainerRef'
      : 'boardContainerRef';
    if (boardRef.current[containerRef]?.current) {
      boardRef.current[containerRef].current.scrollTop = 0;
    }
  }
};

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
 * @returns {{ boardsToAdd, boardsToUpdate, boardIdsToVerifyDeletion }}
 */
export function classifyRemoteBoards(localBoards, remoteBoards, syncMeta = {}) {
  const boardsToAdd = [];
  const boardsToUpdate = [];
  const boardIdsToVerifyDeletion = [];

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

  for (const local of localBoards) {
    const hasServerId = isServerBoard(local);
    const notInRemote = !remoteBoardIds.has(local.id);
    const notLocallyDeleted = !syncMeta[local.id]?.isDeleted;
    const localHasSyncStatus = syncMeta[local.id] != null;

    if (hasServerId && notInRemote && notLocallyDeleted && localHasSyncStatus) {
      boardIdsToVerifyDeletion.push(local.id);
    }
  }

  return {
    boardsToAdd,
    boardsToUpdate,
    boardIdsToVerifyDeletion
  };
}

export const computeScrollState = (itemCount, cols, rows) => ({
  isScroll: itemCount / cols > rows,
  totalRows: Math.ceil(itemCount / cols)
});
