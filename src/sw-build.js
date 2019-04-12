const workboxBuild = require('workbox-build');
const boards = require('./api/boards.json');

function mapImagesToGlobs(boards, globPrefix) {
  let globs = [];

  Object.keys(boards).forEach(boardId => {
    const tiles = boards[boardId].tiles;

    Object.keys(tiles).forEach(tileId => {
      if (tiles[tileId].image) {
        const glob = globPrefix + tiles[tileId].image;

        if (globs.indexOf(glob) >= 0) {
          return;
        }
        globs.push(glob.slice(1, glob.length));
      }
    });
  });

  globs.forEach(glob => {
    console.log(glob);
  });
  return globs;
}

const boardImages = mapImagesToGlobs(boards.advanced, '');

// NOTE: This should be run *AFTER* all your assets are built
const buildSW = () => {
  // This will return a Promise
  return workboxBuild
    .injectManifest({
      swSrc: 'src/sw-template.js',
      swDest: 'build/sw.js',
      globDirectory: 'build',
      globPatterns: ['**/*.{js,css,html}', ...boardImages]
    })
    .then(({ count, size, warnings }) => {
      // Optionally, log any warnings and details.
      warnings.forEach(console.warn);
      console.log(`${count} files will be precached, totaling ${size} bytes.`);
    });
};

buildSW();
