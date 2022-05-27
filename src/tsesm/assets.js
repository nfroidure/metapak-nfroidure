'use strict';

const { getMetapakInfos } = require('../lib.js');

module.exports = (file, packageConf) => {
  // Set types in ts config
  if ('tsconfig.json' === file.name) {
    const { data } = getMetapakInfos(packageConf);
    let contents = JSON.parse(file.data);

    if (data.typesFiles) {
      contents = Object.assign({}, contents, {
        include: [data.typesFiles],
      });
    }
    file.data = JSON.stringify(contents, null, 2);
  }
  return file;
};
