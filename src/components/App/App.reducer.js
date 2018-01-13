import { FINISH_FIRST_VISIT } from './App.constants';

const initialState = {
  isFirstVisit: true
};

function appReducer(state = initialState, action) {
  switch (action.type) {
    case FINISH_FIRST_VISIT:
      return {
        ...state,
        isFirstVisit: false
      };
    default:
      return state;
  }
}

export default appReducer;
