import {
  ACTIVATE_SCANNER,
  TOGGLE_SCANNER,
  DEACTIVATE_SCANNER
} from './ScannerProvider.constants';

const initialState = {
  active: false
};

function scannerProviderReducer(state = initialState, action) {
  switch (action.type) {
    case ACTIVATE_SCANNER:
      return {
        active: true
      };
    case DEACTIVATE_SCANNER:
      return {
        active: true
      };
    case TOGGLE_SCANNER:
      return {
        active: !state.active
      };
    default:
      return state;
  }
}

export default scannerProviderReducer;
