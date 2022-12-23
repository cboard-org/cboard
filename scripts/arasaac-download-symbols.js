const fs = require('fs');
const Axios = require('axios');

const ARASAAC_BASE_PATH_API = 'https://api.arasaac.org/api/';
const jsonData = require('../src/api/arasaac/es.json');
const pictosPath = `pictograms/`;

console.log('Fetching symbol data from ARASAAC API .....');

async function downloadFile(fileUrl, outputLocationPath) {
  const writer = fs.createWriteStream(outputLocationPath);

  return Axios({
    method: 'get',
    url: fileUrl,
    responseType: 'stream'
  }).then(response => {
    //ensure that the user can call `then()` only when the file has
    //been downloaded entirely.

    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      let error = null;
      writer.on('error', err => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on('close', () => {
        if (!error) {
          resolve(true);
        }
        //no need to call the reject here, as it will have been called in the
        //'error' stream;
      });
    });
  });
}

for (let i = 1; i < Math.trunc(jsonData.length / 100); i++) {
  (function(ind) {
    setTimeout(function() {
      for (let j = (i - 1) * 100; j < i * 100; j++) {
        const picto = jsonData[j];
        console.log(j);
        try {
          const apipath = ARASAAC_BASE_PATH_API + pictosPath + picto['id'];
          console.log(apipath);
          const path = './src/api/arasaac/symbols/' + picto['id'] + '.png';
          downloadFile(apipath, path).then(console.log('ok!'));
        } catch (err) {
          console.log('ERROR Failed to fetch symbol data');
          console.log(err.message);
          return;
        }
      }
    }, 1000 + 7000 * ind);
  })(i);
}
