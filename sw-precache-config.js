const boards = require('./src/api/boards.json');

function mapImagesToGlobs(boards, globPrefix) {
  let globs = [];
  Object.keys(boards).forEach(boardId => {
    const symbols = boards[boardId].symbols;
    Object.keys(symbols).forEach(symbolId => {
      if (symbols[symbolId].img) {
        const glob = globPrefix + symbols[symbolId].img;
        if (globs.indexOf(glob) >= 0) {
          return;
        }
        globs.push(glob);
      }
    });
  });
  console.log(
    globs.forEach(glob => {
      console.log(glob);
    })
  );
  return globs;
}

const boardImages = mapImagesToGlobs(boards.advanced, 'build/');

module.exports = {
  stripPrefix: 'build/',
  staticFileGlobs: [
    'build/*.html',
    'build/manifest.json',
    'build/static/**/!(*map*)',
    ...boardImages
  ],
  runtimeCaching: [
    {
      urlPattern: /\/images\//,
      handler: 'cacheFirst',
      options: {
        cache: {
          name: 'images-cache'
        }
      }
    }
  ],
  dontCacheBustUrlsMatching: /\.\w{8}\./,
  swFilePath: 'build/service-worker.js'
};
