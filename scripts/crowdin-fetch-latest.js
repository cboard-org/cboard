const { CROWDIN_API_KEY } = require('../src/config');

console.log('Pulling translations from CrowdIn.');

const https = require('https');
const fs = require('fs');
const resolve = require('path').resolve
const DecompressZip = require('decompress-zip');

const zipFilePath = resolve('./alltx.zip');
const extractPath = resolve('./src/translations')
const cboardSrcPath = resolve('./src/translations/src/cboard.json')

const downloadCboardJson = (onComplete) => {
  console.log('Trying to download latest cboard.json...');
  
  const cboardJson = fs.createWriteStream(cboardSrcPath);
  https.get(`https://api.crowdin.com/api/project/cboard/export-file?file=cboard.json&language=en&key=${CROWDIN_API_KEY}`, function(response) {
    response.pipe(cboardJson);
    cboardJson.on('finish', function() {
      console.log('cboard.json download complete.');
      cboardJson.close(onComplete);
    });
    cboardJson.on('error', function(err) {
      console.log('cboard.json download encountered error!');
      console.log(err);
    });
  });
};

const downloadTranslations = (onComplete) => {
  console.log('Trying to download latest translation strings...');
  
  const allTxZip = fs.createWriteStream(zipFilePath);
  https.get(`https://api.crowdin.com/api/project/cboard/download/all.zip?key=${CROWDIN_API_KEY}`, function(response) {
    response.pipe(allTxZip);
    allTxZip.on('finish', function() {
      console.log('Translation download complete.');
      allTxZip.close(onComplete);
    });
    allTxZip.on('error', function(err) {
      console.log('Translation download encountered error!');
      console.log(err);
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

downloadCboardJson(() => null);
downloadTranslations(extractTranslations);
