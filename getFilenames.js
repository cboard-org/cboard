const fs = require('fs');
const files = fs.readdirSync('./src/translations/');
const filenames = files.reduce(
  (str, file) =>
    str.length ? `${str}, '${file.split('.')[0]}'` : `'${file.split('.')[0]}'`,
  ''
);

fs.writeFile(`./filenames.txt`, filenames);
