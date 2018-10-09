import {
  ACTIVATE_SCANNER,
  TOGGLE_SCANNER,
  DEACTIVATE_SCANNER,
  UPDATE_SCANNER_SETTINGS
} from './ScannerProvider.constants';
import { SCANNING_METHOD_AUTOMATIC } from '../../components/Settings/Scanning/Scanning.constants';
import { LOGIN_SUCCESS } from '../../components/Account/Login/Login.constants';

const initialState = {
  active: false,
  delay: 2000,
  strategy: SCANNING_METHOD_AUTOMATIC
};

function scannerProviderReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      const settings = action.payload.settings || {};
      const { scanning } = settings || {};

      const active = scanning && scanning.active ? scanning.active : state.active;
      const delay = scanning && scanning.delay ? scanning.delay : state.delay;
      const strategy = scanning && scanning.strategy ? scanning.strategy : state.strategy;

      return {
        ...state,
        active,
        delay,
        strategy
      };
    case ACTIVATE_SCANNER:
      return {
        ...state,
        active: true
      };
    case DEACTIVATE_SCANNER:
      return {
        ...state,
        active: false
      };
    case TOGGLE_SCANNER:
      return {
        ...state,
        active: !state.active
      };
    case UPDATE_SCANNER_SETTINGS:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}

export default scannerProviderReducer;
