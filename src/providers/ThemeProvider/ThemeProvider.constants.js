const FONTS_FAMILIES_LIST = [
  {
    fontName: 'Montserrat',
    fontFamily: ['Montserrat', 'sans-serif'].join(',')
  },
  {
    fontName: 'Roboto', //Material UI default font
    fontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(',')
  },
  {
    fontName: 'Chilanka',
    fontFamily: ['Chilanka', 'cursive'].join(',')
  },
  { fontName: 'Hind', fontFamily: ['Hind'].join(',') },
  {
    fontName: 'Nunito',
    fontFamily: [
      'Nunito',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif'
    ].join(',')
  },
  { fontName: 'Oswald', fontFamily: ['Oswald', 'sans-serif'].join(',') },
  {
    fontName: 'Indie Flower',
    fontFamily: ['Indie Flower', 'cursive'].join(',')
  }
];

export const DEFAULT_FONT_FAMILY = 'Roboto';

export const FONTS_FAMILIES = FONTS_FAMILIES_LIST.sort(
  ({ fontName: aFontName }, { fontName: bFontName }) => {
    if (aFontName < bFontName) {
      return -1;
    }
    if (aFontName > bFontName) {
      return 1;
    }
    return 0;
  }
);
