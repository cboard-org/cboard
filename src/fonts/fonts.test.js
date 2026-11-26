import fs from 'fs';
import path from 'path';

import {
  FONTS_FAMILIES,
  DEFAULT_FONT_FAMILY
} from '../providers/ThemeProvider/ThemeProvider.constants';

const css = fs.readFileSync(path.join(__dirname, 'fonts.css'), 'utf8');

const fontFaces = (css.match(/@font-face\s*{[^}]*}/g) || []).map((block) => ({
  family: block.match(/font-family:\s*'([^']+)'/)[1],
  weight: block.match(/font-weight:\s*(\d+)/)[1],
  url: block.match(/url\('([^']+)'\)/)[1]
}));

const resolvePackageCss = (specifier) => {
  const [name, ...subpath] = specifier.split('/');
  const manifest = require.resolve(`${name}/package.json`);
  return path.join(
    path.dirname(manifest),
    subpath.length ? subpath.join('/') : require(manifest).main
  );
};

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

  it('the default font ships a real bold', () => {
    const entry = fs.readFileSync(
      path.join(__dirname, '..', 'index.js'),
      'utf8'
    );
    const fontsourceCss = (entry.match(/import '(fontsource-[^']+)'/g) || [])
      .map((line) => line.match(/'([^']+)'/)[1])
      .map((specifier) => fs.readFileSync(resolvePackageCss(specifier), 'utf8'))
      .join('\n');
    const defaultBold = (
      fontsourceCss.match(/@font-face\s*{[^}]*}/g) || []
    ).filter(
      (block) =>
        block.includes(`font-family: '${DEFAULT_FONT_FAMILY}'`) &&
        /font-weight:\s*700/.test(block)
    );
    expect(defaultBold.length).toBeGreaterThan(0);
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
