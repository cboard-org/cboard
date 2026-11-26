# Bundled fonts

The fonts offered in Settings → Display → Font family, as `.woff2` files with
one `@font-face` rule per font, weight and alphabet in `fonts.css`.
`src/index.js` imports `fonts.css`. Roboto, the default, is not here: it
comes from the `fontsource-roboto` package (`index.css` for regular and
`700.css` for bold, both imported in `src/index.js`).

## Source

- Font files: [Fontsource](https://fontsource.org), served by jsDelivr
  (`cdn.jsdelivr.net/fontsource/fonts/<id>@<version>/`). File list and
  `unicode-range` values come from the Fontsource API
  (`api.fontsource.org/v1/fonts/<id>`).
- Licences: `OFL.txt` from [google/fonts](https://github.com/google/fonts)
  (`ofl/<dir>/OFL.txt`). Every font here is under the SIL Open Font License
  1.1, which requires the licence to ship with the font, so each folder keeps
  its `OFL.txt`.

## Versions

All fonts are pinned to Fontsource `5.3.0` (`VERSION` in
`scripts/fonts/fetch-fonts.js`).

| Font         | Weights  | Subsets                                              |
| ------------ | -------- | ---------------------------------------------------- |
| Andika       | 400, 700 | cyrillic, cyrillic-ext, latin, latin-ext, vietnamese |
| Chilanka     | 400      | latin, latin-ext, malayalam                          |
| Comic Neue   | 400, 700 | latin                                                |
| Hind         | 400, 700 | devanagari, latin, latin-ext                         |
| Indie Flower | 400      | latin, latin-ext                                     |
| Lexend       | 400, 700 | latin, latin-ext, vietnamese                         |
| Montserrat   | 400, 700 | cyrillic, cyrillic-ext, latin, latin-ext, vietnamese |
| Nunito       | 400, 700 | cyrillic, cyrillic-ext, latin, latin-ext, vietnamese |
| Oswald       | 400, 700 | cyrillic, cyrillic-ext, latin, latin-ext, vietnamese |

59 files, about 1.06 MB in total. Thanks to `unicode-range`, the browser only
downloads the files for the selected font and the alphabets on screen; a
Latin-only user of one font downloads about 40 KB.

## Why these choices

- **Regular and bold only.** Tile labels are bold, so every font that has a
  real 700 ships it; Chilanka and Indie Flower have no bold and get a
  synthesized one. Weight 500 renders with 400 and 600 with 700.
- **woff2 only.** Every browser and WebView the app supports reads it, and it
  is the smallest format.
- **In `src/`, not `public/`.** Webpack emits files imported from CSS to
  `build/static/media`, which `sw-precache` caches for offline use and which
  Cordova and Electron pack into the app. Files in `public/` are not
  precached.
- **No Google Fonts CDN.** It does not work offline and sends user requests
  to Google.

## Updating

```sh
node scripts/fonts/fetch-fonts.js
```

Needs Node 18 or newer (built-in `fetch`) and no packages. It deletes and
rewrites each font folder and regenerates `fonts.css`. To add a font or
change versions, edit `FONTS` or `VERSION` in the script, re-run it, and add
the font to `FONTS_FAMILIES_LIST` in
`src/providers/ThemeProvider/ThemeProvider.constants.js` with the same family
name. `src/fonts/fonts.test.js` checks that the two stay in step.
