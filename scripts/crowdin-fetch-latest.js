const crowdinTranslations = require('@crowdin/crowdin-api-client').Translations;
const https = require('https');
const fs = require('fs');
const resolve = require('path').resolve;
const DecompressZip = require('decompress-zip');

// crowdin api key
const CROWDIN_TOKEN = process.env.CROWDIN_PERSONAL_TOKEN;
const CROWDIN_PROJECT_ID = 262825;

// initialization of crowdin client
const credentials = {
  token: CROWDIN_TOKEN
};

// create an instance of the crowdin client
const translationApi = new crowdinTranslations(credentials);

// paths
const zipFilePath = resolve('./alltx.zip');
const extractPath = resolve('./downloads');
const langExtractPath = resolve('./src/translations');

const downloadTranslations = async onComplete => {
  console.log('Trying to download latest translation strings...');

  // trigger a fresh project build
  const buildResponse = await translationApi.buildProject(CROWDIN_PROJECT_ID);
  const buildId = buildResponse.data.id;
  console.log(`Build triggered (ID: ${buildId}). Waiting for it to finish...`);

  // poll until the build is complete
  await waitForBuild(buildId);

  const download = await translationApi.downloadTranslations(
    CROWDIN_PROJECT_ID,
    buildId
  );
  const allTxZip = fs.createWriteStream(zipFilePath);
  https.get(download.data.url, function(response) {
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

const waitForBuild = async buildId => {
  const POLL_INTERVAL_MS = 5000;

  return new Promise((resolve, reject) => {
    const check = async () => {
      try {
        const statusResponse = await translationApi.checkBuildStatus(
          CROWDIN_PROJECT_ID,
          buildId
        );
        const { status, progress } = statusResponse.data;

        process.stdout.write(`\rBuild status: ${status} (${progress}%)   `);

        if (status === 'finished') {
          process.stdout.write('\n');
          console.log('Build finished successfully.');
          resolve();
        } else if (status === 'failed' || status === 'canceled') {
          process.stdout.write('\n');
          reject(new Error(`Build ${status}.`));
        } else {
          setTimeout(check, POLL_INTERVAL_MS);
        }
      } catch (err) {
        reject(err);
      }
    };
    check();
  });
};

const deleteTemporaryDownloadFile = () => {
  console.log('Deleting temp file.');
  try {
    fs.unlinkSync(zipFilePath);
    console.log(`Deleted ${zipFilePath}`);
  } catch (err) {
    console.error(`Error while deleting ${zipFilePath} ` + err.message);
  }
};

const extractTranslations = () => {
  console.log('Extracting zip to translations folder...');

  const unzipper = new DecompressZip(zipFilePath);

  unzipper.on('error', function(err) {
    console.log('DecompressZip Caught an error:', err);
  });

  unzipper.on('extract', function() {
    console.log('DecompressZip finished extracting.');
    deleteTemporaryDownloadFile();
    fs.readdirSync(extractPath).forEach(file => {
      if (file.endsWith('.json')) {
        fs.copyFileSync(`${extractPath}/${file}`, `${langExtractPath}/${file}`);
      }
    });
    const custom = [
      {
        source: 'me-ME',
        dest: 'sr-ME'
      },
      {
        source: 'sr-CS',
        dest: 'sr-RS'
      },
      {
        source: 'tu-TI',
        dest: 'pt-TL'
      },
      {
        source: 'no-NO',
        dest: 'nb-NO'
      }
    ];
    custom.forEach(data => {
      fs.copyFileSync(
        `${extractPath}/${data.source}.json`,
        `${langExtractPath}/${data.dest}.json`
      );
    });
    try {
      fs.rmSync(`${extractPath}`, { recursive: true });
      console.log(`Download folder was deleted.`);
    } catch (err) {
      console.error(`Error while deleting ${extractPath}`, err.message);
    }
  });

  unzipper.extract({
    path: extractPath
  });
};

console.log('Pulling translations from CrowdIn...');
downloadTranslations(extractTranslations);
