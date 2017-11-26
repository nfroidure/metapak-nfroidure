'use strict';

const KARMA_COMMAND = 'npm run karma';

module.exports = (packageConf) => {
  const metapakData = packageConf.metapak && packageConf.metapak.data ?
    packageConf.metapak.data :
    {};

  // Adapting script to work with Babel
  packageConf.scripts = packageConf.scripts || {};
  if(metapakData.testsFiles) {
    packageConf.scripts.karma = 'karma start karma.conf.js';
    packageConf.scripts.test =
      packageConf.scripts.test.contains(KARMA_COMMAND) ?
      packageConf.scripts.test :
      packageConf.scripts.test + ' && ' + KARMA_COMMAND;
  }

  // Istanbul needs a specific version to work with babel
  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.istanbul = '^1.0.0-alpha.2';
  packageConf.devDependencies['babel-cli'] = '^6.9.0';

  return packageConf;
};
