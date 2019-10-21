import { isCordova } from './cordova-util';
import { getFileWriter } from './cordova-disk';

const STATE_NONE = 0;
const STATE_PREPARING = 1;
const STATE_READY = 2;

let fileWriter = null;
let preReadyQueue = [];
let state = STATE_NONE;

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
    state = STATE_PREPARING;
    preReadyQueue.push(buildEvent(event, data));

    getFileWriter('analytics.txt', true)
      .then(([writer, file]) => {
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
