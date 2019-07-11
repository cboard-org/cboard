import * as actions from '../App.actions';
import * as types from '../App.constants';
import { getUser, isFirstVisit, isLogged } from '../App.selectors';

describe('actions', () => {
  it('Checks selectors', () => {
    const state = {
      app: {
        userData: {
          email: 'test'
        },
        isFirstVisit: true
      }
    };
    const user = getUser(state);
    expect(user).toEqual(state.app.userData);
    const firstVisit = isFirstVisit(state);
    expect(firstVisit).toBeTruthy();
    const logged = isLogged(state);
    expect(logged).toBeTruthy();
  });
  it('should create an action to update display settings', () => {
    const payload = {};
    const expectedAction = {
      type: types.UPDATE_DISPLAY_SETTINGS,
      payload
    };
    expect(actions.updateDisplaySettings(payload)).toEqual(expectedAction);
  });

  it('should create an action to update display settings - default payload', () => {
    const expectedAction = {
      type: types.UPDATE_DISPLAY_SETTINGS,
      payload: {}
    };
    expect(actions.updateDisplaySettings()).toEqual(expectedAction);
  });

  it('should create an action to update navigation settings', () => {
    const payload = {};
    const expectedAction = {
      type: types.UPDATE_NAVIGATION_SETTINGS,
      payload
    };
    expect(actions.updateNavigationSettings(payload)).toEqual(expectedAction);
  });

  it('should create an action to update navigation settings - default payload', () => {
    const expectedAction = {
      type: types.UPDATE_NAVIGATION_SETTINGS,
      payload: {}
    };
    expect(actions.updateNavigationSettings()).toEqual(expectedAction);
  });

  it('should create an action to finish first user visit', () => {
    const expectedAction = {
      type: types.FINISH_FIRST_VISIT
    };
    expect(actions.finishFirstVisit()).toEqual(expectedAction);
  });
});
