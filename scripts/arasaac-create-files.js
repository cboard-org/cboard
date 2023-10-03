const { writeFile } = require('fs');
const https = require('https');

const ARASAAC_BASE_PATH_API = 'https://api.arasaac.org/api/';

const locales = [
  'ar',
  'bg',
  'de',
  'el',
  'en',
  'es',
  'fr',
  'he',
  'hr',
  'hu',
  'it',
  'ko',
  'mk',
  'nl',
  'pl',
  'pt',
  'ro',
  'ru',
  'sk',
  'sq',
  'sv',
  'sr',
  'uk',
  'zh'
];

console.log('Fetching symbol data from ARASAAC API .....');

locales.forEach(async locale => {
  const pictosPath = `pictograms/all/${locale}`;
  let jsonData = [];
  try {
    https.get(ARASAAC_BASE_PATH_API + pictosPath, res => {
      let data = [];

      res.on('data', chunk => {
        data.push(chunk);
      });

      res.on('end', () => {
        console.log('. . . SUCCESS Fetching symbol data for locale ' + locale);
        jsonData = JSON.parse(Buffer.concat(data).toString());
        const result = [];
        jsonData.forEach(element => {
          var keywords = [];
          element['keywords'].forEach(kw => {
            keywords.push(kw['keyword']);
          });
          const picto = {
            id: element['_id'],
            kw: keywords
          };
          result.push(picto);
        });

        writeFile(
          './src/api/arasaac/' + locale + '.json',
          JSON.stringify(result),
          error => {
            if (error) {
              console.log('An error has occurred ', error);
              return;
            }
            console.log('Data written successfully to disk');
          }
        );
      });
    });
  } catch (err) {
    console.log('ERROR Failed to fetch symbol data for locale ' + locale);
    console.log(err.message);
    return;
  }
});
