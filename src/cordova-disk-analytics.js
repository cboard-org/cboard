import { isCordova } from './cordova-util';
import { getFileWriter } from './cordova-disk';

const STATE_NONE = 0;
const STATE_PREPARING = 1;
const STATE_READY = 2;

let fileWriter = null;
let writeQueue = [];
let state = STATE_NONE;
let writing = false;

const buildEvent = event => {
  return (
    JSON.stringify({
      time: Date.now(),
      ...event
    }) + '\n'
  );
};

const ensureWrites = () => {
  if (!fileWriter || writing || writeQueue.length === 0) return;

  writing = true;
  fileWriter.write(writeQueue.shift());
};

// Cordova FileWriter does not internally handle multiple simultaneous writes (which would return INVALID_STATE code 7)
// All events are queued. Wait for FileWriter `onwriteend`, before additional writing
export const log = event => {
  if (!isCordova()) return;

  writeQueue.push(buildEvent(event));
  ensureWrites();

  if (STATE_NONE === state) {
    state = STATE_PREPARING;

    getFileWriter('analytics.txt', true)
      .then(([writer, file]) => {
        fileWriter = writer;
        fileWriter.onwriteend = () => {
          writing = false;
          ensureWrites();
        };
        state = STATE_READY;

        ensureWrites();
      })
      .catch(e => {
        console.error(e);

        // Reset for reattempts
        state = STATE_NONE;
      });
  }
};
