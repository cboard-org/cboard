import { ADD_RECORD } from './VoiceRecorder.constants';

const initialState = {
  audioURL: ''
};

function voiceRecorderReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_RECORD:
      return {
        audioURL: action.blob
      };
    default:
      return state;
  }
}

export default voiceRecorderReducer;
