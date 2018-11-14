const initialState = { audioURL: '', iconsColor: 'black' };

function voiceRecorderReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_RECORD':
      return {
        audioURL: action.Blob,
        iconsColor: 'black'
      };
    case 'START_RECORD':
      return {
        iconsColor: action.color
      };
    default:
      return state;
  }
}
export default voiceRecorderReducer;
