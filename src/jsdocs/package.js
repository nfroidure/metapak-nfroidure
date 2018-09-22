'use strict';

const { getMetapakInfos } = require('../lib.js');
const { apiPath } = require('../config.js');

module.exports = packageConf => {
  const { data } = getMetapakInfos(packageConf);

  // Adding documentation generation script
  packageConf.scripts = packageConf.scripts || {};
  packageConf.scripts.doc = `echo "# API" > ${apiPath}; jsdoc2md ${
    data.files
  } >> ${apiPath}`;

  // Add doc deps
  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies['jsdoc-to-markdown'] = '^4.0.1';

  // Avoid GreenKeeper to update automatically added modules
  if ('metapak-nfroidure' !== packageConf.name) {
    packageConf.greenkeeper.ignore = packageConf.greenkeeper.ignore.concat([
      'jsdoc-to-markdown',
    ]);
  }

  return packageConf;
};
