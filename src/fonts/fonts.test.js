import fs from 'fs';
import path from 'path';

import { FONTS_FAMILIES } from '../providers/ThemeProvider/ThemeProvider.constants';

const css = fs.readFileSync(path.join(__dirname, 'fonts.css'), 'utf8');

const fontFaces = (css.match(/@font-face\s*{[^}]*}/g) || []).map((block) => ({
  family: block.match(/font-family:\s*'([^']+)'/)[1],
  weight: block.match(/font-weight:\s*(\d+)/)[1],
  url: block.match(/url\('([^']+)'\)/)[1]
}));

const familiesWithWeight = (weight) =>
  fontFaces.filter((face) => face.weight === weight).map((face) => face.family);

describe('fonts.css', () => {
  it('every url() in fonts.css points to an existing file', () => {
    expect(fontFaces.length).toBeGreaterThan(0);
    fontFaces.forEach(({ url }) =>
      expect(fs.existsSync(path.join(__dirname, url))).toBe(true)
    );
  });

  it('every listed font except Roboto has a regular @font-face', () => {
    FONTS_FAMILIES.filter((f) => f.fontName !== 'Roboto').forEach((f) =>
      expect(familiesWithWeight('400')).toContain(f.fontName)
    );
  });

  it('new fonts ship a real bold', () => {
    ['Andika', 'Comic Neue', 'Lexend'].forEach((name) =>
      expect(familiesWithWeight('700')).toContain(name)
    );
  });

  it('lists the agreed fonts', () => {
    expect(FONTS_FAMILIES.map((f) => f.fontName)).toEqual([
      'Andika',
      'Chilanka',
      'Comic Neue',
      'Hind',
      'Indie Flower',
      'Lexend',
      'Montserrat',
      'Nunito',
      'Oswald',
      'Roboto'
    ]);
  });
});
