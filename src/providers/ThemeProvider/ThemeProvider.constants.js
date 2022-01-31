export const DEFAULT_THEME = 'light';
export const DARK_THEME = 'dark';

export const FONTS_FAMILIES_PROPS = [
  //Default font
  {
    fontName: 'Cboard Helvetica',
    fontFamily: ['Helvetica', 'Arial', 'sans-serif'].join(',')
  },
  //-----------
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

export const DEFAULT_FONT_FAMILY = FONTS_FAMILIES_PROPS[0].fontName;
