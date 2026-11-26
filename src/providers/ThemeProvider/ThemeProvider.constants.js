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
  { fontName: 'Hind', fontFamily: ['Hind', 'sans-serif'].join(',') },
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
  },
  { fontName: 'Andika', fontFamily: ['Andika', 'sans-serif'].join(',') },
  {
    fontName: 'Comic Neue',
    fontFamily: ['Comic Neue', 'Comic Sans MS', 'cursive'].join(',')
  },
  {
    fontName: 'Lexend',
    fontFamily: ['Lexend', 'Century Gothic', 'sans-serif'].join(',')
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
