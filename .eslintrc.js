module.exports = {
  extends: 'airbnb',
  rules: {
    'react/forbid-prop-types': 'off', // airbnb use error
    'react/jsx-filename-extension': ['error', { extensions: ['.js'] }], // airbnb is using .jsx
    'react/no-find-dom-node': 'warn', // wishlist, one day
    'react/no-unused-prop-types': 'off', // Is still buggy
    'react/no-array-index-key': 'off'
  }
}