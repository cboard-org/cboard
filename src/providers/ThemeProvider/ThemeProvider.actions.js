import { CHANGE_THEME } from './ThemeProvider.constants';

export function changeTheme(theme) {
  return {
    type: CHANGE_THEME,
    theme
  };
}
