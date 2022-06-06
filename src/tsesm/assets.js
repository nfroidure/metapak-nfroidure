'use strict';

const { getMetapakInfos } = require('../lib.js');

module.exports = (file, packageConf) => {
  const { data } = getMetapakInfos(packageConf);

  // Set types in ts config
  if ('tsconfig.json' === file.name) {
    let contents = JSON.parse(file.data);

    if (data.typesFiles) {
      contents = Object.assign({}, contents, {
        include: [data.typesFiles],
      });
    }
    file.data = JSON.stringify(contents, null, 2);
  }
  if ('.vscode/settings.json' === file.name) {
    if (data.childPackage) {
      file.data = '';
    }
  }
  return file;
};
