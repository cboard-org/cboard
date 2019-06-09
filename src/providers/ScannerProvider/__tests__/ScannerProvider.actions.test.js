import * as actions from '../ScannerProvider.actions';
import * as types from '../ScannerProvider.constants';

describe('actions', () => {
  it('should create an action to REPLACE_ME', () => {
    const expectedAction = {
      type: types.ACTIVATE_SCANNER
    };
    expect(actions.activateScanner()).toEqual(expectedAction);
  });

  it('should create an action to REPLACE_ME', () => {
    const expectedAction = {
      type: types.DEACTIVATE_SCANNER
    };
    expect(actions.deactivateScanner()).toEqual(expectedAction);
  });

  it('should create an action to REPLACE_ME', () => {
    const expectedAction = {
      type: types.TOGGLE_SCANNER
    };

    expect(actions.toggleScanner()).toEqual(expectedAction);
  });

  it('should create an action to REPLACE_ME', () => {
    const payload = {};
    const expectedAction = {
      type: types.UPDATE_SCANNER_SETTINGS,
      payload
    };
    expect(actions.updateScannerSettings(payload)).toEqual(expectedAction);
  });
});
