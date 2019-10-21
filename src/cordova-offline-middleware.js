import { saveToDisk } from './cordova-disk';
import { log } from './cordova-disk-analytics';
import { isCordova } from './cordova-util';
import filenamifyUrl from 'filenamify-url';
import {
  CREATE_TILE,
  EDIT_TILES,
  IMPORT_BOARDS,
  ADD_BOARDS
} from './components/Board/Board.constants';
import { editTiles } from './components/Board/Board.actions';
import { eventsMap } from './analytics';

// Reuse of beacon events, outside the beacon framework, to stash analytics to disk independent of online status
const offlineAnalyticsMiddleware = store => next => action => {
  const generateEvent = eventsMap[action.type];
  if (!generateEvent) {
    next(action);
    return;
  }

  const prevState = store.getState();
  const result = next(action);
  const nextState = store.getState();
  const e = generateEvent(action, prevState, nextState);
  log(e);

  return result;
};

// Offline data caching
// Watch events that generate new system data & download/swap remote urls for local urls
const cacheImage = (url, path) => {
  return fetch(url).then(async response =>
    saveToDisk(path, await response.blob())
  );
};

const cacheAndUpdate = (tile, boardId, store) => {
  const imagePath = tile.image;
  if (!imagePath.startsWith('http')) return;

  cacheImage(imagePath, filenamifyUrl(imagePath)).then(path => {
    const updatedTile = {
      ...tile,
      image: path
    };
    store.dispatch(editTiles([updatedTile], boardId));
  });
};

const offlineBoardsMiddleware = store => next => action => {
  const result = next(action);

  switch (action.type) {
    case CREATE_TILE: {
      cacheAndUpdate(action.tile, action.boardId, store);
      break;
    }

    case EDIT_TILES: {
      action.tiles.forEach(tile => cacheAndUpdate(tile, action.boardId, store));
      break;
    }

    case ADD_BOARDS:
    case IMPORT_BOARDS: {
      action.boards.forEach(board =>
        board.tiles.forEach(tile => cacheAndUpdate(tile, board.id, store))
      );
      break;
    }

    default:
      break; // silence warning
  }

  return result;
};

export default (isCordova()
  ? [offlineAnalyticsMiddleware, offlineBoardsMiddleware]
  : []);
