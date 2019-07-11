import scannerProviderReducer from '../ScannerProvider.reducer';
import {
  ACTIVATE_SCANNER,
  TOGGLE_SCANNER,
  DEACTIVATE_SCANNER,
  UPDATE_SCANNER_SETTINGS
} from '../ScannerProvider.constants';
import {
  SCANNING_METHOD_AUTOMATIC,
  SCANNING_METHOD_MANUAL
} from '../../../components/Settings/Scanning/Scanning.constants';
import { LOGIN_SUCCESS } from '../../../components/Account/Login/Login.constants';

let mockScanner, initialState;

describe('reducer', () => {
  beforeEach(() => {
    initialState = {
      active: false,
      delay: 2000,
      strategy: SCANNING_METHOD_AUTOMATIC
    };
    mockScanner = {
      active: true,
      delay: 4000,
      strategy: SCANNING_METHOD_MANUAL
    };
  });
  it('should return the initial state', () => {
    expect(scannerProviderReducer(undefined, {})).toEqual(initialState);
  });
  it('should handle login ', () => {
    const login = {
      type: LOGIN_SUCCESS,
      payload: initialState
    };
    expect(scannerProviderReducer(initialState, login)).toEqual(initialState);
  });
  it('should handle updateScannerSettings ', () => {
    const updateScannerSettings = {
      type: UPDATE_SCANNER_SETTINGS,
      payload: mockScanner
    };
    expect(scannerProviderReducer(initialState, updateScannerSettings)).toEqual(
      mockScanner
    );
  });
  it('should handle deactivateScanner ', () => {
    const deactivateScanner = {
      type: DEACTIVATE_SCANNER
    };
    expect(scannerProviderReducer(mockScanner, deactivateScanner)).toEqual({
      ...mockScanner,
      active: false
    });
  });
  it('should handle activateScanner ', () => {
    const activateScanner = {
      type: ACTIVATE_SCANNER
    };
    expect(scannerProviderReducer(initialState, activateScanner)).toEqual({
      ...initialState,
      active: true
    });
  });
  it('should handle toggleScanner ', () => {
    const toggleScanner = {
      type: TOGGLE_SCANNER
    };
    expect(scannerProviderReducer(initialState, toggleScanner)).toEqual({
      ...initialState,
      active: true
    });
  });
});
