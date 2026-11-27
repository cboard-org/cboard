import { useTheme } from '@material-ui/core/styles';
import { purple } from '@material-ui/core/colors';

const LIGHT_BACKGROUND = '#eee';
const LIGHT_TEXT = '#333';
const ACCENT = '#aa00ff';
const DARK_OVERLAY = 'rgba(0, 0, 0, 0.75)';

export function getJoyrideStyles(theme, overrides = {}) {
  const dark = theme.palette.type === 'dark';
  const backgroundColor = dark
    ? theme.palette.background.paper
    : LIGHT_BACKGROUND;
  const { options = {}, ...rest } = overrides;

  return {
    ...rest,
    options: {
      width: 500,
      zIndex: 10000,
      ...options,
      arrowColor: backgroundColor,
      backgroundColor,
      primaryColor: ACCENT,
      textColor: dark ? theme.palette.text.primary : LIGHT_TEXT,
      ...(dark && { overlayColor: DARK_OVERLAY })
    },
    ...(dark && { buttonBack: { color: purple[100] } })
  };
}

export function useJoyrideStyles(overrides) {
  return getJoyrideStyles(useTheme(), overrides);
}
