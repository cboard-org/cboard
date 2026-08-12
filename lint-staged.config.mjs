/** @type {import('lint-staged').Configuration} */
const config = {
  '*': 'prettier --write --ignore-unknown'
};

export default config;
