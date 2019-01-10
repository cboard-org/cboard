import { ADD_RECORD } from './VoiceRecorder.constants';

export function addRecord(blob) {
  return {
    type: ADD_RECORD,
    blob
  };
}
