const {
  UploadStorage,
  SourceFiles,
  MachineTranslation,
  Translations,
  ProjectsGroups
} = require('@crowdin/crowdin-api-client');
const fs = require('fs');
const resolve = require('path').resolve;

// crowdin api key
const CROWDIN_TOKEN = process.env.CROWDIN_PERSONAL_TOKEN;
const CROWDIN_PROJECT_ID = 262825;
const SOURCE_FILE_NAME = 'cboard.json';
const cboardSrcPath = resolve('./src/translations/src/cboard.json');

if (!CROWDIN_TOKEN) {
  console.error(
    'Error: CROWDIN_PERSONAL_TOKEN environment variable is not set.'
  );
  process.exit(1);
}

// initialization of crowdin clients
const credentials = { token: CROWDIN_TOKEN };
const uploadStorageApi = new UploadStorage(credentials);
const sourceFilesApi = new SourceFiles(credentials);
const machineTranslationApi = new MachineTranslation(credentials);
const translationsApi = new Translations(credentials);
const projectsGroupsApi = new ProjectsGroups(credentials);

const uploadSourceFile = async () => {
  console.log('Updating remote translations.');

  // 1. Read the local source file
  console.log(`Reading ${cboardSrcPath}...`);
  const fileContent = fs.readFileSync(cboardSrcPath);

  // 2. Upload file content to Crowdin storage
  console.log('Uploading file to Crowdin storage...');
  const storageResponse = await uploadStorageApi.addStorage(
    SOURCE_FILE_NAME,
    fileContent,
    'application/json'
  );
  const storageId = storageResponse.data.id;
  console.log(`File uploaded to storage with ID: ${storageId}`);

  // 3. Find the existing source file in the project
  console.log(
    `Looking up '${SOURCE_FILE_NAME}' in Crowdin project ${CROWDIN_PROJECT_ID}...`
  );
  const filesResponse = await sourceFilesApi.listProjectFiles(
    CROWDIN_PROJECT_ID,
    {
      filter: SOURCE_FILE_NAME
    }
  );
  const sourceFile = filesResponse.data.find(
    item => item.data.name === SOURCE_FILE_NAME
  );

  if (!sourceFile) {
    throw new Error(
      `Source file '${SOURCE_FILE_NAME}' was not found in Crowdin project ${CROWDIN_PROJECT_ID}. ` +
        'Please create it manually in the Crowdin project before pushing changes.'
    );
  }

  const fileId = sourceFile.data.id;
  console.log(`Found source file with ID: ${fileId}`);

  // 4. Update the source file with the new storage content
  console.log('Updating source file in Crowdin...');
  await sourceFilesApi.updateOrRestoreFile(CROWDIN_PROJECT_ID, fileId, {
    storageId,
    updateOption: 'keep_translations_and_approvals'
  });

  console.log(
    `Successfully updated '${SOURCE_FILE_NAME}' in Crowdin project ${CROWDIN_PROJECT_ID}.`
  );

  await runMachineTranslation(fileId);
};

const runMachineTranslation = async fileId => {
  // 1. Find the Microsoft MT engine from the account-level engine list
  console.log('\nLooking up Microsoft machine translation engine...');
  const mtListResponse = await machineTranslationApi.listMts({ limit: 100 });
  const microsoftOrgEngine = mtListResponse.data.find(
    mt =>
      mt.data.type === 'microsoft' ||
      mt.data.name.toLowerCase().includes('microsoft')
  );

  if (!microsoftOrgEngine) {
    throw new Error(
      'No Microsoft MT engine found in your Crowdin account. ' +
        'Please configure one under Account > Machine Translation.'
    );
  }

  const orgMicrosoftId = microsoftOrgEngine.data.id;
  console.log(`Found Microsoft engine (account ID: ${orgMicrosoftId})`);

  // 2. Get project target languages and project-configured MT engines
  console.log('Fetching project configuration...');
  const projectResponse = await projectsGroupsApi.getProject(
    CROWDIN_PROJECT_ID
  );
  const targetLanguageIds = projectResponse.data.targetLanguageIds;
  const projectMtEngineIds = (
    (projectResponse.data.mtPreTranslate &&
      projectResponse.data.mtPreTranslate.mts) ||
    []
  ).map(e => e.mtId);

  console.log(`Found ${targetLanguageIds.length} target languages.`);

  // 3. Build candidate list.
  //    Use the org Microsoft engine ID if it's directly configured on the project.
  //    Otherwise fall back to project-scoped engine IDs (sorted descending by ID —
  //    the highest ID was configured last and typically has the broadest language support).
  let candidateIds;
  if (projectMtEngineIds.includes(orgMicrosoftId)) {
    candidateIds = [orgMicrosoftId];
  } else {
    candidateIds = [...projectMtEngineIds].sort((a, b) => b - a);
  }

  if (candidateIds.length === 0) {
    throw new Error(
      'No MT engines are configured for this project. ' +
        'Please add the Microsoft MT engine in Crowdin project settings > Machine Translation.'
    );
  }

  // 4. Try each engine in order; retry without unsupported languages on first failure.
  //    The first engine that successfully starts a job is used.
  for (const engineId of candidateIds) {
    let languagesToTranslate = targetLanguageIds.slice();

    for (let attempt = 0; attempt <= 1; attempt++) {
      try {
        const preTranslationResponse = await translationsApi.applyPreTranslation(
          CROWDIN_PROJECT_ID,
          {
            method: 'mt',
            engineId,
            fileIds: [fileId],
            languageIds: languagesToTranslate,
            autoApproveOption: 'none',
            duplicateTranslations: false,
            scope: 'untranslated'
          }
        );

        const skipped = targetLanguageIds.length - languagesToTranslate.length;
        console.log(
          `Using engine ID ${engineId}: translating ${
            languagesToTranslate.length
          } / ${targetLanguageIds.length} languages` +
            (skipped > 0
              ? ` (${skipped} not supported by this engine and skipped)`
              : '')
        );

        const preTranslationId = preTranslationResponse.data.identifier;
        console.log(`Pre-translation job started (ID: ${preTranslationId})`);
        await waitForPreTranslation(preTranslationId);
        return;
      } catch (e) {
        const match =
          attempt === 0 &&
          e.message.match(/Languages \[([^\]]+)\] are not supported/);
        if (match) {
          const unsupported = match[1].split(',').map(s => s.trim());
          console.log(
            `Engine ${engineId}: ${
              unsupported.length
            } languages not supported — retrying without them...`
          );
          languagesToTranslate = languagesToTranslate.filter(
            l => !unsupported.includes(l)
          );
          if (languagesToTranslate.length === 0) {
            console.log(
              `Engine ${engineId}: no supported languages, trying next engine...`
            );
            break;
          }
        } else {
          throw e;
        }
      }
    }
  }

  throw new Error(
    'None of the configured MT engines support any of the project target languages.'
  );
};

const waitForPreTranslation = async preTranslationId => {
  const POLL_INTERVAL_MS = 5000;

  const poll = () =>
    new Promise((resolve, reject) => {
      const check = async () => {
        try {
          const statusResponse = await translationsApi.preTranslationStatus(
            CROWDIN_PROJECT_ID,
            preTranslationId
          );
          const { status, progress } = statusResponse.data;

          process.stdout.write(
            `\rMachine translation status: ${status} (${progress}%)   `
          );

          if (status === 'finished') {
            process.stdout.write('\n');
            console.log('Machine translation completed successfully.');
            resolve();
          } else if (status === 'failed' || status === 'canceled') {
            process.stdout.write('\n');
            reject(new Error(`Machine translation job ${status}.`));
          } else {
            setTimeout(check, POLL_INTERVAL_MS);
          }
        } catch (err) {
          reject(err);
        }
      };
      check();
    });

  await poll();
};

uploadSourceFile().catch(err => {
  console.error('Failed to update remote translations:', err.message || err);
  process.exit(1);
});
