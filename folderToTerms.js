var fs = require('fs');
var path = require('path');

function symbolsToSet(filename) {
  terms = fs.readdirSync(filename).map(function (child) {
    const term =
      path
        .basename(filename + '/' + child, '.svg')
        .replace(/_|\d\w?/g, ' ')
        .replace(/(.*)( , )(.*)/, '$3 $1')
        .trim()
        .toLowerCase();
    return term;
  });
  return new Set(terms);
}

if (module.parent == undefined) {
  const symbolsSet = symbolsToSet('./public/images/mulberry-symbols/');
  const translationTerms = {};

  symbolsSet.forEach(symbol => {
    translationTerms[symbol] = symbol;
  });

  var json = JSON.stringify(translationTerms);
  fs.writeFile('symbol-terms.json', json);
}