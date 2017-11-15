const fs = require('fs');
const buildVersion = require('./src/build-version.js');
const data = `module.exports = '${Number(buildVersion) + 1}'`;
fs.writeFile('./src/build-version.js', data);
