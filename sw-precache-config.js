// const fs = require('fs');
// const boardData = './src/api/boardData.js';
// const obj = JSON.parse(fs.readFileSync(boardData, 'utf8'));

// const boardData = require('./src/api/boardData.js');
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

console.log([...boardImages].length);

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