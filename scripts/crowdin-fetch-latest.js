const { CROWDIN_API_KEY } = require('../src/config');

console.log('CROWDIN_API_KEY:', CROWDIN_API_KEY);

const https = require('https');
const fs = require('fs');
const resolve = require('path').resolve
// resolve('../../bb/tmp.txt')

// const extract = require('extract-zip')
// const admzip = require('adm-zip');
const DecompressZip = require('decompress-zip');

const zipFilePath = resolve('./alltx2.zip');
const extractPath = resolve('./src/translations')
console.log('extractPath:', extractPath);
console.log('zipFilePath:', zipFilePath);


const downloadTranslations = (onComplete) => {
  console.log('Trying to download latest translation strings...');
  
  const file = fs.createWriteStream(zipFilePath);
  https.get(`https://api.crowdin.com/api/project/cboard/download/all.zip?key=${CROWDIN_API_KEY}`, function(response) {
    console.log('Download finished. Saving.');
      
    response.pipe(file);
    file.on('finish', function() {
      console.log('Translation download complete.');
      file.close(onComplete);
    });
    file.on('error', function(err) {
      console.log('Translation download encountered error!');
      console.log(err);
      // file.close();
    });
  });
};

const deleteTemporaryDownloadFile = () => {
  console.log('Deleting temp file.');
  fs.unlinkSync(zipFilePath)
};

const extractTranslations = () => {
  console.log('Extracting zip to translations folder.');

  const unzipper = new DecompressZip(zipFilePath)
    
  unzipper.on('error', function (err) {
    console.log('DecompressZip Caught an error:', err);
  });
    
  unzipper.on('extract', function (log) {
    console.log('DecompressZip finished extracting.');
    deleteTemporaryDownloadFile();
  });
    
  unzipper.on('progress', function (fileIndex, fileCount) {
    console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
  });
    
  unzipper.extract({
      path: extractPath,
      filter: function (file) {
          return file.type !== "SymbolicLink";
      }
  });
};

downloadTranslations(extractTranslations);
