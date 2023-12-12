const webpack = require('webpack');

module.exports = {
  webpack: function(config, env) {
    // Added fallbacks
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        os: require.resolve('os-browserify/browser'),
        path: require.resolve('path-browserify'),
        stream: require.resolve('stream-browserify')
      }
    };

    // Keeping existing overrides
    return {
      ...config,
      mode: 'development',
      optimization: { minimize: false }
    };
  }
};
