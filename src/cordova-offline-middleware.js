import { saveToDisk } from './cordova-disk';
import filenamifyUrl from 'filenamify-url';
import { isCordova } from './cordova-util';

const cacheImage = (url, path) => {
  console.log('Downloading', url, 'to', path);
  return fetch(url).then(response => saveToDisk(path, response.blob()));
};

export const offlineBoardsMiddleware = store => next => action => {
  if (!isCordova()) {
    next(action);
    return;
  }

  if ('cboard/Board/CREATE_TILE' === action.type) {
    const imagePath = action.tile.image;
    if (!imagePath.startsWith('http')) return;

    cacheImage(imagePath, filenamifyUrl(imagePath)).then(path => {
      // Dispatch path update?
      console.log('Image cached');
    });
  }

  next(action);
};
