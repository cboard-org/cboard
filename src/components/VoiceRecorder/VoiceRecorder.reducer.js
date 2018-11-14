import { ADD_RECORD } from './VoiceRecorder.constants';

const initialState = {
  audioURL: '',
  isRecording: false
};

function voiceRecorderReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_RECORD:
      return {
        audioURL: action.Blob
      };
    default:
      return state;
  }
}

export default voiceRecorderReducer;
