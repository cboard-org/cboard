const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

imagemin(['images/*.{jpg,png}'], 'build/images', {
  plugins: [imageminJpegtran(), imageminPngquant({ quality: '65-80' })]
}).then(files => {
  console.log(files);
  //=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
});
