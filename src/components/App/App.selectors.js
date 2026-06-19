import isEmpty from 'lodash/isEmpty';

export const getUser = state => state.app.userData;
export const isLogged = state => !isEmpty(getUser(state));
export const isFirstVisit = state => state.app.isFirstVisit;
export const isUnauthEditModalDismissed = state =>
  state.app.unauthEditModalDismissed;
