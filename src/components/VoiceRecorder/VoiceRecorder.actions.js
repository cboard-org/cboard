import { ADD_RECORD } from './VoiceRecorder.constants';
import { START_RECORD } from './VoiceRecorder.constants';

export function addRecord(newBlob) {
  return {
    type: ADD_RECORD,
    newBlob
  };
}
export function startRecord(color) {
  return {
    type: START_RECORD,
    color
  };
}
