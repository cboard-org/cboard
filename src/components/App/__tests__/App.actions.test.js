import * as actions from '../App.actions';
import * as types from '../App.constants';

describe('actions', () => {
  it('should create an action to update display settings', () => {
    const payload = {};
    const expectedAction = {
      type: types.UPDATE_DISPLAY_SETTINGS,
      payload
    };
    expect(actions.updateDisplaySettings(payload)).toEqual(expectedAction);
  });

  it('should create an action to update navigation settings', () => {
    const payload = {};
    const expectedAction = {
      type: types.UPDATE_NAVIGATION_SETTINGS,
      payload
    };
    expect(actions.updateNavigationSettings(payload)).toEqual(expectedAction);
  });

  it('should create an action to finish first user visit', () => {
    const expectedAction = {
      type: types.FINISH_FIRST_VISIT
    };
    expect(actions.finishFirstVisit()).toEqual(expectedAction);
  });
});
