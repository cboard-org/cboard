import {
  CHANGE_THEME,
  DEFAULT_THEME,
  DARK_THEME
} from './ThemeProvider.constants';

const initialState = {
  themes: [DEFAULT_THEME, DARK_THEME],
  theme: DEFAULT_THEME
};

function themeProviderReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_THEME:
      return {
        ...state,
        theme: action.theme
      };
    default:
      return state;
  }
}

export default themeProviderReducer;
