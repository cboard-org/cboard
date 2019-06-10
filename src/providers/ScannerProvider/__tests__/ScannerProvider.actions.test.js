import * as actions from '../ScannerProvider.actions';
import * as types from '../ScannerProvider.constants';

describe('actions', () => {
  it('should create an action to activate scanner', () => {
    const expectedAction = {
      type: types.ACTIVATE_SCANNER
    };
    expect(actions.activateScanner()).toEqual(expectedAction);
  });

  it('should create an action to deactivate scanner', () => {
    const expectedAction = {
      type: types.DEACTIVATE_SCANNER
    };
    expect(actions.deactivateScanner()).toEqual(expectedAction);
  });

  it('should create an action to toggle scanner', () => {
    const expectedAction = {
      type: types.TOGGLE_SCANNER
    };

    expect(actions.toggleScanner()).toEqual(expectedAction);
  });

  it('should create an action to update scanner settings', () => {
    const payload = {};
    const expectedAction = {
      type: types.UPDATE_SCANNER_SETTINGS,
      payload
    };
    expect(actions.updateScannerSettings(payload)).toEqual(expectedAction);
  });

  it('should create an action to update scanner settings - default payload', () => {
    const expectedAction = {
      type: types.UPDATE_SCANNER_SETTINGS,
      payload: {}
    };
    expect(actions.updateScannerSettings()).toEqual(expectedAction);
  });
});
