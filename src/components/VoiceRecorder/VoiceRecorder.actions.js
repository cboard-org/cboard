import { ADD_RECORD } from './VoiceRecorder.constants';
import { START_RECORD } from './VoiceRecorder.constants';

export function addRecord(Blob) {
  return {
    type: ADD_RECORD,
    Blob
  };
}
export function startRecord(color) {
  return {
    type: START_RECORD,
    color
  };
}
