const boards = require('./src/api/boards.json');

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
    'build/static/**/*.*',
    ...boardImages
  ],
  maximumFileSizeToCacheInBytes: 4194304,
  runtimeCaching: [
    {
      urlPattern: /\/static\//,
      handler: 'cacheFirst',
      options: {
        cache: {
          name: 'static-assets',
          maxEntries: 200
        }
      }
    },
    {
      urlPattern: /\/symbols\/mulberry/,
      handler: 'cacheFirst',
      options: {
        cache: {
          name: 'symbols-mulberry'
        }
      }
    },
    {
      urlPattern: /\/symbols\/arasaac/,
      handler: 'cacheFirst',
      options: {
        cache: {
          name: 'symbols-arasaac'
        }
      }
    },
    {
      urlPattern: /\/symbols\/cboard/,
      handler: 'cacheFirst',
      options: {
        cache: {
          name: 'symbols-cboard'
        }
      }
    }
  ],
  navigateFallback: '/index.html',
  navigateFallbackWhitelist: [/^\/(?!api).*/],
  dontCacheBustUrlsMatching: /\.(js|css|json|jpg|jpeg|png|svg|ico)$/,
  dynamicUrlToDependencies: {
    '/': ['build/index.html']
  },
  swFilePath: 'build/service-worker.js'
};
