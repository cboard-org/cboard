var fs = require('fs');
var path = require('path');

function dirTree(filename) {
  terms = fs.readdirSync(filename).map(function (child) {
    const fileName = path.basename(filename + '/' + child);
    const src = filename.replace('./public/', '') + fileName;
    const name =
      path
        .basename(filename + '/' + child, '.svg')
        .replace(/_|\d\w?/g, ' ')
        .replace(/(.*)( , )(.*)/, '$3 $1')
        .trim()
        .toLowerCase();

    // const src = path.basename(filename + '/' + child);
    const info = { name, src };
    return info;
  });

  return terms;
}

if (module.parent == undefined) {
  // node dirTree.js ~/foo/bar
  const util = require('util');
  const tree = dirTree('./public/images/mulberry-symbols/');
  const flags = {};
  const filtered = tree.filter((image) => {
    if (flags[image.term]) {
      return false;
    }
    flags[image.term] = true;
    return true;
  });
  console.log(util.inspect(filtered.length, false, null));
  var json = JSON.stringify(tree);
  fs.writeFile('mulberry-symbols.json', json);
}