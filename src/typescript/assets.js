'use strict';

const { getMetapakInfos } = require('../lib.js');

module.exports = (file, packageConf) => {
  // Set types in ts config
  if ('tsconfig.json' === file.name) {
    const { data } = getMetapakInfos(packageConf);
    if (data.types) {
      file.data = JSON.stringify(
        Object.assign({}, JSON.parse(file.data), {
          types: data.types,
        }),
        null,
        2
      );
    }
  }

  return file;
};
