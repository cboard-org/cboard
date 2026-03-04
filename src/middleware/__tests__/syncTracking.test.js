import { syncTrackingMiddleware } from '../syncTracking';
import {
  CREATE_TILE,
  EDIT_TILES,
  DELETE_TILES,
  MARK_BOARD_DIRTY
} from '../../components/Board/Board.constants';

describe('syncTrackingMiddleware', () => {
  let store;
  let next;
  let middleware;

  beforeEach(() => {
    store = { dispatch: jest.fn() };
    next = jest.fn(action => action);
    middleware = syncTrackingMiddleware(store)(next);
  });

  it('should dispatch MARK_BOARD_DIRTY after CREATE_TILE when boardId is present', () => {
    const action = { type: CREATE_TILE, boardId: 'board-1', tile: {} };
    middleware(action);

    expect(store.dispatch).toHaveBeenCalledWith({
      type: MARK_BOARD_DIRTY,
      boardId: 'board-1'
    });
  });

  it('should dispatch MARK_BOARD_DIRTY after EDIT_TILES when boardId is present', () => {
    const action = { type: EDIT_TILES, boardId: 'board-2', tiles: [] };
    middleware(action);

    expect(store.dispatch).toHaveBeenCalledWith({
      type: MARK_BOARD_DIRTY,
      boardId: 'board-2'
    });
  });

  it('should dispatch MARK_BOARD_DIRTY after DELETE_TILES when boardId is present', () => {
    const action = { type: DELETE_TILES, boardId: 'board-3', tiles: [] };
    middleware(action);

    expect(store.dispatch).toHaveBeenCalledWith({
      type: MARK_BOARD_DIRTY,
      boardId: 'board-3'
    });
  });

  it('should NOT dispatch MARK_BOARD_DIRTY for other action types', () => {
    const action = { type: 'SOME_OTHER_ACTION', boardId: 'board-1' };
    middleware(action);

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should NOT dispatch MARK_BOARD_DIRTY when boardId is missing', () => {
    const action = { type: CREATE_TILE, tile: {} };
    middleware(action);

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should NOT dispatch MARK_BOARD_DIRTY when boardId is null', () => {
    const action = { type: CREATE_TILE, boardId: null, tile: {} };
    middleware(action);

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should NOT dispatch MARK_BOARD_DIRTY when boardId is undefined', () => {
    const action = { type: EDIT_TILES, boardId: undefined, tiles: [] };
    middleware(action);

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should always call next() with the original action', () => {
    const action = { type: CREATE_TILE, boardId: 'board-1', tile: {} };
    middleware(action);

    expect(next).toHaveBeenCalledWith(action);
  });

  it('should return the result of next()', () => {
    const action = { type: CREATE_TILE, boardId: 'board-1', tile: {} };
    const nextResult = { someData: 'value' };
    next.mockReturnValue(nextResult);

    const result = middleware(action);

    expect(result).toBe(nextResult);
  });
});
