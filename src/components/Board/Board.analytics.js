import { trackEvent } from '@redux-beacon/google-analytics-gtag';

import {
  IMPORT_BOARDS,
  CREATE_BOARD,
  CHANGE_BOARD,
  CREATE_TILE,
  DELETE_TILES,
  EDIT_TILES
} from './Board.constants';

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

const deleteTiles = trackEvent((action, prevState, nextState) => ({
  category: 'Editing',
  action: 'Delete Tiles',
  label: ''
}));

const editTiles = trackEvent((action, prevState, nextState) => ({
  category: 'Editing',
  action: 'Edit Tiles',
  label: ''
}));

const eventsMap = {
  [IMPORT_BOARDS]: importBoards,
  [CREATE_BOARD]: createBoard,
  [CHANGE_BOARD]: changeBoard,
  [CREATE_TILE]: createTile,
  [DELETE_TILES]: deleteTiles,
  [EDIT_TILES]: editTiles
};

export default eventsMap;
