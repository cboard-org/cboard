import { trackEvent } from '@redux-beacon/google-analytics-gtag';

import {
  IMPORT_BOARDS,
  ADD_BOARD,
  CHANGE_BOARD,
  ADD_BOARD_TILE,
  DELETE_BOARD_TILES,
  EDIT_BOARD_TILES
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
  const boardName = nextState.board.boards.find(
    board => board.id === action.boardId
  ).nameKey;

  return {
    category: 'Navigation',
    action: 'Change Board',
    label: boardName
  };
});

const addBoard = trackEvent((action, prevState, nextState) => ({
  category: 'Editing',
  action: 'Added Board',
  label: action.boardName
}));

const addBoardTile = trackEvent((action, prevState, nextState) => ({
  category: 'Editing',
  action: 'Added Board Tile',
  label: action.tile.label
}));

const deleteBoardTiles = trackEvent((action, prevState, nextState) => {
  const deletedTiles = getTiles(
    prevState.board.boards,
    action.boardId,
    action.tiles
  );

  return {
    category: 'Editing',
    action: 'Deleted Board Tiles',
    label: deletedTiles
  };
});

const editBoardTiles = trackEvent((action, prevState, nextState) => {
  const editedTiles = action.tiles.reduce(
    (acc, tile) => (acc ? `${acc}, ${tile.label}` : tile.label),
    ''
  );
  return {
    category: 'Editing',
    action: 'Edited Board Tiles',
    label: editedTiles
  };
});

const eventsMap = {
  [IMPORT_BOARDS]: importBoards,
  [ADD_BOARD]: addBoard,
  [CHANGE_BOARD]: changeBoard,
  [ADD_BOARD_TILE]: addBoardTile,
  [DELETE_BOARD_TILES]: deleteBoardTiles,
  [EDIT_BOARD_TILES]: editBoardTiles
};

export default eventsMap;
