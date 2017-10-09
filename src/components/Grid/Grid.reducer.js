import { CHANGE_LAYOUTS } from './Grid.constants';

const initialState = {
  layouts: {}
};

function gridReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_LAYOUTS:
      return {
        ...state,
        layouts: {
          ...state.layouts,
          [action.id]: action.layouts
        }
      };
    default:
      return state;
  }
}

export default gridReducer;
