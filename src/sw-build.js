const workboxBuild = require('workbox-build');
const boards = require('./api/boards.json');

function mapImagesToGlobs(boards, globPrefix) {
  let globs = [];

  Object.values(boards).forEach(board => {
    const tiles = board.tiles;

    Object.values(tiles).forEach(tile => {
      if (tile.image) {
        const glob = globPrefix + tile.image;

        if (globs.indexOf(glob) >= 0) {
          return;
        }
        globs.push(glob.slice(1, glob.length));
      }
    });
  });

  console.log(`Cached symbols: ${globs.length}`);
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
      globPatterns: ['**/*.{js,css,html}', ...boardImages],
      // Increase the limit to 4mb:
      maximumFileSizeToCacheInBytes: 4 * 1024 * 1024
    })
    .then(({ count, size, warnings }) => {
      // Optionally, log any warnings and details.
      warnings.forEach(console.warn);
      console.log(`${count} files will be precached, totaling ${size} bytes.`);
    });
};

buildSW();
