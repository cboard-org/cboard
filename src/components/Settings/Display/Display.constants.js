export const DISPLAY_SIZE_EXTRASMALL = 'ExtraSmall';
export const DISPLAY_SIZE_SMALL = 'Small';
export const DISPLAY_SIZE_STANDARD = 'Standard';
export const DISPLAY_SIZE_LARGE = 'Large';
export const DISPLAY_SIZE_EXTRALARGE = 'ExtraLarge';
export const DISPLAY_SIZES = [
  DISPLAY_SIZE_EXTRASMALL,
  DISPLAY_SIZE_SMALL,
  DISPLAY_SIZE_STANDARD,
  DISPLAY_SIZE_LARGE,
  DISPLAY_SIZE_EXTRALARGE
];

// Add label positioning options
export const LABEL_POSITION_ABOVE = 'Above';
export const LABEL_POSITION_BELOW = 'Below';
export const LABEL_POSITION_HIDDEN = 'Hidden';

export const DISPLAY_SIZE_GRID_COLS = {
  [DISPLAY_SIZE_EXTRASMALL]: {
    lg: 10,
    md: 10,
    sm: 8,
    xs: 6,
    xxs: 6
  },
  [DISPLAY_SIZE_SMALL]: {
    lg: 8,
    md: 8,
    sm: 6,
    xs: 5,
    xxs: 4
  },
  [DISPLAY_SIZE_STANDARD]: {
    lg: 6,
    md: 6,
    sm: 5,
    xs: 4,
    xxs: 3
  },
  [DISPLAY_SIZE_LARGE]: {
    lg: 4,
    md: 4,
    sm: 3,
    xs: 2,
    xxs: 2
  },
  [DISPLAY_SIZE_EXTRALARGE]: {
    lg: 3,
    md: 3,
    sm: 2,
    xs: 1,
    xxs: 1
  }
};
