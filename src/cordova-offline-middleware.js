import { saveToDisk } from './cordova-disk';
import filenamifyUrl from 'filenamify-url';
import { isCordova } from './cordova-util';
import { CREATE_TILE } from './components/Board/Board.constants';
import { editTiles } from './components/Board/Board.actions';

const cacheImage = (url, path) => {
  return fetch(url).then(async response =>
    saveToDisk(path, await response.blob())
  );
};

export const offlineBoardsMiddleware = store => next => action => {
  if (!isCordova()) {
    next(action);
    return;
  }

  if (CREATE_TILE === action.type) {
    const imagePath = action.tile.image;
    if (!imagePath.startsWith('http')) return;

    cacheImage(imagePath, filenamifyUrl(imagePath)).then(path => {
      const updatedTile = {
        ...action.tile,
        image: path
      };
      store.dispatch(editTiles([updatedTile], action.boardId));
    });
  }

  next(action);
};
