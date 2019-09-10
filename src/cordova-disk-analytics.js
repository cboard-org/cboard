import { isCordova } from './cordova-util';

const STATE_NONE = 0;
const STATE_PREPARING = 1;
const STATE_READY = 2;

let fileWriter = null;
let preReadyQueue = [];
let state = STATE_NONE;

const setupWriter = () => {
  return new Promise((resolve, reject) => {
    window.resolveLocalFileSystemURL(
      window.cordova.file.dataDirectory,
      dirEntry => {
        dirEntry.getFile(
          'analytics.txt',
          { create: true, exclusive: false },
          fileEntry => {
            fileEntry.createWriter(writer => {
              writer.seek(writer.length);
              resolve(writer);
            });
          },
          reject
        );
      },
      reject
    );
  });
};

const buildEvent = (event, data) => {
  return (
    JSON.stringify({
      time: Date.now(),
      event,
      ...data
    }) + '\n'
  );
};

export const log = (event, data) => {
  if (!isCordova()) return;

  if (STATE_READY === state) {
    fileWriter.write(buildEvent(event, data));
    return;
  }

  if (STATE_PREPARING === state) {
    preReadyQueue.push(buildEvent(event, data));
    return;
  }

  if (STATE_NONE === state) {
    preReadyQueue.push(buildEvent(event, data));
    state = STATE_PREPARING;
    setupWriter()
      .then(writer => {
        fileWriter = writer;
        state = STATE_READY;

        // Flush pending events
        preReadyQueue.forEach(e => fileWriter.write(e));
      })
      .catch(e => {
        console.error(e);

        // Reset for reattempts
        state = STATE_NONE;
      });
  }
};
