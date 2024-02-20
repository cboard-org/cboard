import { trackEvent } from '@redux-beacon/google-analytics-gtag';
import { isCordova, cvaTrackEvent } from '../../cordova-util';

import {
  IMPORT_BOARDS,
  CREATE_BOARD,
  CHANGE_BOARD,
  CREATE_TILE,
  DELETE_TILES,
  EDIT_TILES,
  CLICK_SYMBOL,
  CLICK_OUTPUT
} from './Board.constants';

const getTiles = (boards, boardId, tilesId) => {
  const board = boards.find(board => board.id === boardId);

  const tiles = board.tiles
    .filter(tile => tilesId.includes(tile.id))
    .reduce((acc, tile) => (acc ? `${acc}, ${tile.label}` : tile.label), '');
  return tiles;
};

const importBoards = trackEvent((action, prevState, nextState) => {
  const gaEvent = {
    category: 'Backup',
    action: 'Import Boards'
  };
  if (isCordova()) {
    cvaTrackEvent(gaEvent.category, gaEvent.action);
  }
  return gaEvent;
});

const changeBoard = trackEvent((action, prevState, nextState) => {
  const board = nextState.board.boards.find(
    board => board.id === action.boardId
  );
  let boardName = 'root';
  if (typeof board !== 'undefined') {
    boardName = board.nameKey || board.name || board.id;
  }
  const gaEvent = {
    category: 'Navigation',
    action: 'Change Board',
    label: boardName
  };
  if (isCordova()) {
    cvaTrackEvent(gaEvent.category, gaEvent.action, gaEvent.label);
  }
  return gaEvent;
});

const createBoard = trackEvent((action, prevState, nextState) => {
  const gaEvent = {
    category: 'Editing',
    action: 'Create Board',
    label: action.boardName
  };
  if (isCordova()) {
    cvaTrackEvent(gaEvent.category, gaEvent.action, gaEvent.label);
  }
  return gaEvent;
});

const createTile = trackEvent((action, prevState, nextState) => {
  const gaEvent = {
    category: 'Editing',
    action: 'Create Tile',
    label: action.tile.label
  };
  if (isCordova()) {
    cvaTrackEvent(gaEvent.category, gaEvent.action, gaEvent.label);
  }
  return gaEvent;
});

const deleteTiles = trackEvent((action, prevState, nextState) => {
  const deletedTiles = getTiles(
    prevState.board.boards,
    action.boardId,
    action.tiles
  );
  const gaEvent = {
    category: 'Editing',
    action: 'Delete Tiles',
    label: deletedTiles
  };
  if (isCordova()) {
    cvaTrackEvent(gaEvent.category, gaEvent.action, gaEvent.label);
  }
  return gaEvent;
});

const editTiles = trackEvent((action, prevState, nextState) => {
  const editedTiles = action.tiles.reduce(
    (acc, tile) => (acc ? `${acc}, ${tile.label}` : tile.label),
    ''
  );
  const gaEvent = {
    category: 'Editing',
    action: 'Edit Tiles',
    label: editedTiles
  };
  if (isCordova()) {
    cvaTrackEvent(gaEvent.category, gaEvent.action, gaEvent.label);
  }
  return gaEvent;
});

const clickSymbol = trackEvent((action, prevState, nextState) => {
  const gaEvent = {
    category: 'Navigation',
    action: 'Click Symbol',
    label: action.symbolLabel
  };
  if (isCordova()) {
    cvaTrackEvent(gaEvent.category, gaEvent.action, gaEvent.label);
  }
  return gaEvent;
});

const clickOutput = trackEvent((action, prevState, nextState) => {
  const gaEvent = {
    category: 'Speech',
    action: 'Click Output',
    label: action.outputPhrase
  };
  if (isCordova()) {
    cvaTrackEvent(gaEvent.category, gaEvent.action, gaEvent.label);
  }
  return gaEvent;
});

const eventsMap = {
  [IMPORT_BOARDS]: importBoards,
  [CREATE_BOARD]: createBoard,
  [CHANGE_BOARD]: changeBoard,
  [CREATE_TILE]: createTile,
  [DELETE_TILES]: deleteTiles,
  [EDIT_TILES]: editTiles,
  [CLICK_SYMBOL]: clickSymbol,
  [CLICK_OUTPUT]: clickOutput
};

export default eventsMap;
