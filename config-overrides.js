module.exports = {
  webpack: function(config, env) {
    return {
      ...config,
      mode: 'development',
      optimization: { minimize: false }
    };
  }
};
