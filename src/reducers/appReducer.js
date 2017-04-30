import { Map } from 'immutable';
import { isFunction as _isFunction } from 'lodash';

const EMPTY_READONLY_OBJECT = {};

const INITIAL_STATE = Map({
  boards: EMPTY_READONLY_OBJECT,
});

const ACTION_TYPE_TO_REDUCER = {

};

const app = (state = INITIAL_STATE, action) => {
  const reducer = ACTION_TYPE_TO_REDUCER[action.type];
  return _isFunction(reducer) ? reducer(state, action) : state;
};

export default app;
