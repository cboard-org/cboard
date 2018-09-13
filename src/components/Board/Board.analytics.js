import { trackEvent } from '@redux-beacon/google-analytics-gtag';

import {
  IMPORT_BOARDS,
  CREATE_BOARD,
  CHANGE_BOARD,
  CREATE_TILE,
  DELETE_TILES,
  EDIT_TILES
} from './Board.constants';

const getTiles = (boards, boardId, tilesId) => {
  const board = boards.find(board => board.id === boardId);

  const tiles = board.tiles
    .filter(tile => tilesId.includes(tile.id))
    .reduce((acc, tile) => (acc ? `${acc}, ${tile.label}` : tile.label), '');
  return tiles;
};

const importBoards = trackEvent((action, prevState, nextState) => ({
  category: 'Backup',
  action: 'Import Boards'
}));

const changeBoard = trackEvent((action, prevState, nextState) => {
  const board = nextState.board.boards.find(
    board => board.id === action.boardId
  );
  const boardName = board.nameKey || board.name || board.id;

  return {
    category: 'Navigation',
    action: 'Change Board',
    label: boardName
  };
});

const createBoard = trackEvent((action, prevState, nextState) => ({
  category: 'Editing',
  action: 'Create Board',
  label: action.boardName
}));

const createTile = trackEvent((action, prevState, nextState) => ({
  category: 'Editing',
  action: 'Create Tile',
  label: action.tile.label
}));

const deleteTiles = trackEvent((action, prevState, nextState) => {
  const deletedTiles = getTiles(
    prevState.board.boards,
    action.boardId,
    action.tiles
  );

  return {
    category: 'Editing',
    action: 'Delete Tiles',
    label: deletedTiles
  };
});

const editTiles = trackEvent((action, prevState, nextState) => {
  const editedTiles = action.tiles.reduce(
    (acc, tile) => (acc ? `${acc}, ${tile.label}` : tile.label),
    ''
  );
  return {
    category: 'Editing',
    action: 'Edit Tiles',
    label: editedTiles
  };
});

const eventsMap = {
  [IMPORT_BOARDS]: importBoards,
  [CREATE_BOARD]: createBoard,
  [CHANGE_BOARD]: changeBoard,
  [CREATE_TILE]: createTile,
  [DELETE_TILES]: deleteTiles,
  [EDIT_TILES]: editTiles
};

export default eventsMap;
