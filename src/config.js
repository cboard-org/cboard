const R = require('ramda');

const ENV_LIST = ['local', 'prod'];
const CBOARD_ENV = process.env.CBOARD_ENV;

// eslint-disable-next-line import/no-dynamic-require
const privates = require(`../.private/${CBOARD_ENV}.js`);

if (!CBOARD_ENV || !ENV_LIST.includes(CBOARD_ENV)) {
  throw new Error('CBOARD_ENV must match one of ${ENV_LIST} ');
}

// Merge public config with decrypted private config for app config.
// eslint-disable-next-line import/no-dynamic-require
let config = require(`../env/${CBOARD_ENV}`);
config = R.mergeAll([config, privates, { CBOARD_ENV }]);

module.exports = config;
