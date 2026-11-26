import { useTheme } from '@material-ui/core/styles';

const LIGHT_BACKGROUND = '#eee';
const LIGHT_TEXT = '#333';
const ACCENT = '#aa00ff';
const LIGHT_OVERLAY = 'rgba(0, 0, 0, 0.5)';
const DARK_OVERLAY = 'rgba(0, 0, 0, 0.75)';
// Next keeps the accent fill with a white label. That purple fails as
// Back-button text on a dark tooltip, so Back uses purple 100.
const DARK_BACK_BUTTON = '#e1bee7';

export function getJoyrideStyles(theme, overrides = {}) {
  const dark = theme.palette.type === 'dark';
  const backgroundColor = dark
    ? theme.palette.background.paper
    : LIGHT_BACKGROUND;
  const textColor = dark ? theme.palette.text.primary : LIGHT_TEXT;
  const backColor = dark ? DARK_BACK_BUTTON : ACCENT;
  const { options: optionOverrides = {}, tooltipContent, ...rest } = overrides;

  return {
    ...rest,
    options: {
      width: 500,
      zIndex: 10000,
      ...optionOverrides,
      arrowColor: backgroundColor,
      backgroundColor,
      overlayColor: dark ? DARK_OVERLAY : LIGHT_OVERLAY,
      primaryColor: ACCENT,
      textColor
    },
    tooltip: {
      backgroundColor,
      color: textColor
    },
    tooltipTitle: {
      color: textColor
    },
    tooltipContent: {
      color: textColor,
      ...tooltipContent
    },
    buttonNext: {
      backgroundColor: ACCENT,
      color: '#fff'
    },
    buttonBack: {
      color: backColor
    },
    buttonSkip: {
      color: textColor
    },
    buttonClose: {
      color: textColor
    }
  };
}

export function useJoyrideStyles(overrides) {
  return getJoyrideStyles(useTheme(), overrides);
}
