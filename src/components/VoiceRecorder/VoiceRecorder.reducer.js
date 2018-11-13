const initialState = { audioURL: '', iconsColor: 'black' };

function AddRecord(state = initialState, action) {
  switch (action.type) {
    case 'ADD_RECORD':
      return {
        audioURL: action.newBlob,
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
export default AddRecord;
