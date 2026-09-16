/*
 * check-messages.js
 *
 * Verifies that every translation string defined in *.messages.js files under
 * src/ is present in src/translations/src/cboard.json.
 *
 * Usage:
 *   node scripts/check-messages.js           # report missing keys only
 *   node scripts/check-messages.js --write   # report and add missing keys
 */
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const cboardPath = path.join(
  __dirname,
  '..',
  'src',
  'translations',
  'src',
  'cboard.json'
);

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') continue;
      walk(full, acc);
    } else if (entry.name.endsWith('.messages.js')) {
      acc.push(full);
    }
  }
  return acc;
}

// Remove /* */ block comments and // line comments (respecting string literals).
function stripComments(src) {
  let out = '';
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === "'" || c === '"' || c === '`') {
      const quote = c;
      out += c;
      i++;
      while (i < n && src[i] !== quote) {
        if (src[i] === '\\') {
          out += src[i] + (src[i + 1] || '');
          i += 2;
        } else {
          out += src[i];
          i++;
        }
      }
      out += src[i] || '';
      i++;
    } else if (c === '/' && src[i + 1] === '/') {
      while (i < n && src[i] !== '\n') i++;
    } else if (c === '/' && src[i + 1] === '*') {
      i += 2;
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++;
      i += 2;
    } else {
      out += c;
      i++;
    }
  }
  return out;
}

// Extract { id, defaultMessage } pairs from a messages file using a JS-ish parser.
function extractMessages(content) {
  content = stripComments(content);
  const results = [];
  const idRegex = /id:\s*'((?:[^'\\]|\\.)*)'/g;
  let m;
  const idPositions = [];
  while ((m = idRegex.exec(content)) !== null) {
    idPositions.push({ id: m[1], index: m.index, end: idRegex.lastIndex });
  }
  for (let i = 0; i < idPositions.length; i++) {
    const { id, end } = idPositions[i];
    const nextIndex =
      i + 1 < idPositions.length ? idPositions[i + 1].index : content.length;
    const slice = content.slice(end, nextIndex);
    const dmMatch = slice.match(/defaultMessage:\s*([\s\S]*)/);
    let defaultMessage = null;
    if (dmMatch) {
      defaultMessage = parseStringValue(dmMatch[1]);
    }
    results.push({ id, defaultMessage });
  }
  return results;
}

// Parse a string value that may be a single quoted string, possibly concatenated
// across multiple lines with '+'. Stops at the trailing comma/brace.
function parseStringValue(raw) {
  let parts = [];
  let i = 0;
  while (i < raw.length) {
    // skip whitespace and '+'
    while (i < raw.length && /[\s+]/.test(raw[i])) i++;
    if (raw[i] !== "'" && raw[i] !== '"' && raw[i] !== '`') break;
    const quote = raw[i];
    i++;
    let str = '';
    while (i < raw.length && raw[i] !== quote) {
      if (raw[i] === '\\') {
        str += raw[i] + raw[i + 1];
        i += 2;
      } else {
        str += raw[i];
        i++;
      }
    }
    i++; // skip closing quote
    parts.push(str);
    // skip whitespace to check for continuation '+'
    while (i < raw.length && /\s/.test(raw[i])) i++;
    if (raw[i] !== '+') break;
  }
  // Resolve the JS escape sequences that were preserved from the source string.
  const joined = parts.join('');
  return joined.replace(/\\(u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|.)/g, (_, esc) => {
    switch (esc[0]) {
      case 'n':
        return '\n';
      case 't':
        return '\t';
      case 'r':
        return '\r';
      case 'b':
        return '\b';
      case 'f':
        return '\f';
      case 'v':
        return '\v';
      case '0':
        return '\0';
      case 'u':
      case 'x':
        return String.fromCodePoint(parseInt(esc.slice(1), 16));
      default:
        return esc;
    }
  });
}

const files = walk(srcDir);
const cboard = JSON.parse(fs.readFileSync(cboardPath, 'utf8'));

const missing = [];
const allIds = new Set();
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const msgs = extractMessages(content);
  for (const msg of msgs) {
    allIds.add(msg.id);
    if (!(msg.id in cboard)) {
      missing.push({ id: msg.id, defaultMessage: msg.defaultMessage, file });
    }
  }
}

console.log('Total messages.js files:', files.length);
console.log('Total message ids found:', allIds.size);
console.log('Missing from cboard.json:', missing.length);
console.log(JSON.stringify(missing, null, 2));

if (process.argv.includes('--write') && missing.length) {
  for (const { id, defaultMessage } of missing) {
    cboard[id] = defaultMessage == null ? '' : defaultMessage;
  }
  fs.writeFileSync(cboardPath, JSON.stringify(cboard, null, 2) + '\n', 'utf8');
  console.log('Added', missing.length, 'keys to cboard.json');
}
