import isEmpty from 'lodash.isempty';

export const getUser = state => state.app.userData;
export const isLogged = state => !isEmpty(getUser(state));
export const isFirstVisit = state => state.app.isFirstVisit;
