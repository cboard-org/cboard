module.exports = {
  stripPrefix: 'build/',
  staticFileGlobs: [
    'build/*.html',
    'build/manifest.json',
    'build/static/**/!(*map*)'
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