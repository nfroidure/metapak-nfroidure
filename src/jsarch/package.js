'use strict';

const { getMetapakData } = require('../lib.js');

module.exports = packageConf => {
  const metapakData = getMetapakData(packageConf);

  // Adding documentation generation script
  packageConf.scripts = packageConf.scripts || {};
  packageConf.scripts.architecture =
    'jsarch ' + metapakData.files + ' > ARCHITECTURE.md';
  // Add doc deps
  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.jsarch = '^1.3.0';

  // Avoid GreenKeeper to update automatically added modules
  if ('metapak-nfroidure' !== packageConf.name) {
    packageConf.greenkeeper.ignore = packageConf.greenkeeper.ignore.concat([
      'jsarch',
    ]);
  }

  return packageConf;
};
