/*
 * check-messages.js
 *
 * Verifies that every translation string defined in *.messages.js files under
 * src/ is present in src/translations/src/cboard.json.
 *
 * Usage:
 *   node scripts/check-messages.js           # report missing keys; exits 1 if any
 *   node scripts/check-messages.js --write   # report and add missing keys
 */
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const srcDir = path.join(__dirname, '..', 'src');
const cboardPath = path.join(srcDir, 'translations', 'src', 'cboard.json');

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

function staticString(node) {
  if (!node) return null;
  if (ts.isStringLiteralLike(node)) return node.text;
  if (ts.isParenthesizedExpression(node)) return staticString(node.expression);
  if (
    ts.isBinaryExpression(node) &&
    node.operatorToken.kind === ts.SyntaxKind.PlusToken
  ) {
    const left = staticString(node.left);
    const right = staticString(node.right);
    if (left !== null && right !== null) return left + right;
  }
  return null;
}

function propertyValue(object, name) {
  const property = object.properties.find(
    (property) =>
      ts.isPropertyAssignment(property) &&
      (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)) &&
      property.name.text === name
  );
  return property?.initializer;
}

function extractMessages(sourceFile) {
  const factories = new Set();
  for (const statement of sourceFile.statements) {
    if (
      !ts.isImportDeclaration(statement) ||
      statement.moduleSpecifier.text !== 'react-intl'
    ) {
      continue;
    }
    const bindings = statement.importClause?.namedBindings;
    if (!bindings || !ts.isNamedImports(bindings)) continue;
    for (const binding of bindings.elements) {
      if ((binding.propertyName ?? binding.name).text === 'defineMessages') {
        factories.add(binding.name.text);
      }
    }
  }

  const messages = [];
  function visit(node) {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      factories.has(node.expression.text)
    ) {
      const [map] = node.arguments;
      if (map && ts.isObjectLiteralExpression(map)) {
        for (const property of map.properties) {
          if (
            !ts.isPropertyAssignment(property) ||
            !ts.isObjectLiteralExpression(property.initializer)
          ) {
            continue;
          }
          const descriptor = property.initializer;
          const id = staticString(propertyValue(descriptor, 'id'));
          if (id === null) continue;
          const defaultMessage = staticString(
            propertyValue(descriptor, 'defaultMessage')
          );
          messages.push({ id, defaultMessage });
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return messages;
}

const files = walk(srcDir);
const cboard = JSON.parse(fs.readFileSync(cboardPath, 'utf8'));
const program = ts.createProgram(files, {
  allowJs: true,
  noLib: true,
  noResolve: true,
  types: []
});
const syntaxErrors = program.getSyntacticDiagnostics();
if (syntaxErrors.length) {
  console.error(
    ts.formatDiagnostics(syntaxErrors, {
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      getCanonicalFileName: (file) => file,
      getNewLine: () => ts.sys.newLine
    })
  );
  process.exit(1);
}

const missing = [];
const allIds = new Set();
for (const file of files) {
  const messages = extractMessages(program.getSourceFile(file));
  for (const message of messages) {
    allIds.add(message.id);
    if (!(message.id in cboard)) {
      missing.push({ ...message, file });
    }
  }
}

console.log('Total messages.js files:', files.length);
console.log('Total message ids found:', allIds.size);
console.log('Missing from cboard.json:', missing.length);
console.log(JSON.stringify(missing, null, 2));

if (process.argv.includes('--write') && missing.length) {
  for (const { id, defaultMessage } of missing) {
    cboard[id] = defaultMessage ?? '';
  }
  fs.writeFileSync(cboardPath, JSON.stringify(cboard, null, 2) + '\n', 'utf8');
  console.log('Added', missing.length, 'keys to cboard.json');
} else if (missing.length) {
  process.exitCode = 1;
}
