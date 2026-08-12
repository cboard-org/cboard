/** @type {import('lint-staged').Configuration} */
export default {
  '*.{js,jsx,mjs,cjs,ts,tsx,json,css,md,yml,yaml,html}': 'prettier --write',
};
