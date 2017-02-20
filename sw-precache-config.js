const boardData = require('./src/api/boardData');

function mapImagesToGlobs(boards, globPrefix) {
  let globs = [];
  boards.forEach(board => {
    board.buttons.forEach(button => {

      if (button.img) {
        const glob = globPrefix + button.img;
        const exists = globs.indexOf(glob) !== -1;
        if (exists) { return; }
        globs.push(glob);
      }
    });
  });
  console.log(globs.forEach(glob=>{console.log(glob)}));
  return globs;
}

const boardImages = mapImagesToGlobs(boardData.boards, 'build/');

module.exports = {
  stripPrefix: 'build/',
  staticFileGlobs: [
    'build/*.html',
    'build/manifest.json',
    'build/static/**/!(*map*)',
    ...boardImages
  ],
  runtimeCaching: [{
    urlPattern: /\/images\//,
    handler: 'cacheFirst',
    options: {
      cache: {
        name: 'images-cache'
      }
    }
  }],
  dontCacheBustUrlsMatching: /\.\w{8}\./,
  swFilePath: 'build/service-worker.js'
};