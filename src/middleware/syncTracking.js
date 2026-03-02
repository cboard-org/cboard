import {
  CREATE_TILE,
  EDIT_TILES,
  DELETE_TILES,
  MARK_BOARD_DIRTY
} from '../components/Board/Board.constants';

// Single declarative list: actions that make a board's content dirty
const BOARD_DIRTYING_ACTIONS = new Set([CREATE_TILE, EDIT_TILES, DELETE_TILES]);

export const syncTrackingMiddleware = store => next => action => {
  const result = next(action);
  if (BOARD_DIRTYING_ACTIONS.has(action.type) && action.boardId) {
    store.dispatch({ type: MARK_BOARD_DIRTY, boardId: action.boardId });
  }
  return result;
};
