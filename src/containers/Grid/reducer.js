import { CHANGE_LAYOUTS } from './constants';

const initialState = {
  layouts: {}
};

function gridReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_LAYOUTS:
      return Object.assign({}, state, {
        layouts: Object.assign({}, state.layouts, { [action.id]: action.layouts })
      });
    default:
      return state;
  }
}

export default gridReducer;
