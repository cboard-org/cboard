import {
  IS_BROWSING_FROM_APPLE_TOUCH,
  IS_BROWSING_FROM_SAFARI
} from '../../constants';

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
  onNavigate,
  onBoardNotFound
}) => {
  const hasAction = tile.action && tile.action.startsWith('+');

  if (tile.loadBoard) {
    const nextBoard = findNextBoard(tile, boards);

    if (nextBoard) {
      if (changeBoard) changeBoard(nextBoard.id);

      if (navigationSettings.vocalizeFolders) {
        vocalizeTile(tile, speak, { hasAction });
      }

      if (onNavigate) onNavigate(nextBoard.id);

      return { navigated: true, nextBoardId: nextBoard.id };
    } else {
      if (onBoardNotFound) onBoardNotFound(tile);
      return { navigated: false };
    }
  }

  if (!navigationSettings.quietBuilderMode) {
    vocalizeTile(tile, speak, { hasAction });
  }

  if (changeOutput) {
    changeOutput([...output, tile]);
  }

  return { navigated: false };
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
