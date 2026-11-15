const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');

function fixture(t, messages, catalog = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cboard-check-messages-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  const script = path.join(root, 'scripts', 'check-messages.js');
  const source = path.join(root, 'src', 'fixture.messages.js');
  const catalogPath = path.join(
    root,
    'src',
    'translations',
    'src',
    'cboard.json'
  );
  fs.mkdirSync(path.dirname(script));
  fs.mkdirSync(path.dirname(catalogPath), { recursive: true });
  fs.copyFileSync(path.join(__dirname, 'check-messages.js'), script);
  fs.writeFileSync(source, messages);
  fs.writeFileSync(catalogPath, JSON.stringify(catalog));

  return {
    check: (...args) =>
      spawnSync(process.execPath, [script, ...args], {
        encoding: 'utf8',
        env: {
          ...process.env,
          NODE_PATH: path.join(__dirname, '..', 'node_modules')
        }
      }),
    readCatalog: () => JSON.parse(fs.readFileSync(catalogPath, 'utf8'))
  };
}

test('ignores ID-like text in a default message', (t) => {
  const { check, readCatalog } = fixture(
    t,
    `import { defineMessages } from 'react-intl';
     export default defineMessages({
       existing: {
         id: 'cboard.review.existing',
         defaultMessage: "Enter id: 'example' to continue"
       }
     });`,
    { 'cboard.review.existing': "Enter id: 'example' to continue" }
  );

  const checked = check();
  assert.equal(checked.status, 0, checked.stderr || checked.stdout);
  assert.match(checked.stdout, /Total message ids found: 1/);
  assert.equal(check('--write').status, 0);
  assert.deepEqual(readCatalog(), {
    'cboard.review.existing': "Enter id: 'example' to continue"
  });
});

test('reports missing template literal IDs and writes their default text', (t) => {
  const { check, readCatalog } = fixture(
    t,
    `import { defineMessages as messages } from 'react-intl';
     export default messages({
       missing: {
         defaultMessage: 'Use ' + ('a symbol\\u002e'),
         id: \`cboard.review.missing\`
       }
     });`
  );

  const checked = check();
  assert.equal(checked.status, 1, checked.stderr || checked.stdout);
  assert.match(checked.stdout, /"id": "cboard\.review\.missing"/);
  assert.deepEqual(readCatalog(), {});

  const written = check('--write');
  assert.equal(written.status, 0, written.stderr || written.stdout);
  assert.deepEqual(readCatalog(), { 'cboard.review.missing': 'Use a symbol.' });
  assert.equal(check().status, 0);
});
