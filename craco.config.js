const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  webpack: {
    entry: './src/index.js',
    plugins: [new NodePolyfillPlugin({ excludeAliases: ['console'] })],
    resolve: {
      extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx']
    },
    configure: (webpackConfig, { env, paths }) => {
      const isCordovaDebug = process.argv.includes('--cordova-debug');
      if (isCordovaDebug) {
        webpackConfig.mode = 'development';
        webpackConfig.optimization = { minimize: false };
        console.log('Cordova debug mode enabled');
      }

      webpackConfig.ignoreWarnings = [
        function ignoreSourcemapsloaderWarnings(warning) {
          return (
            warning.module?.resource.includes('node_modules') &&
            warning.details?.includes('source-map-loader')
          );
        }
      ];

      return webpackConfig;
    }
  },
  babel: {
    plugins: ['babel-plugin-transform-import-meta']
  }
};
