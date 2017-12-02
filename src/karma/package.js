'use strict';

const KARMA_COMMAND = 'npm run karma';

module.exports = packageConf => {
  const metapakData =
    packageConf.metapak && packageConf.metapak.data
      ? packageConf.metapak.data
      : {};

  // Adapting script to work with Babel
  packageConf.scripts = packageConf.scripts || {};
  if (metapakData.testsFiles) {
    packageConf.scripts.karma = 'karma start karma.conf.js';
    packageConf.scripts.test = packageConf.scripts.test.includes(KARMA_COMMAND)
      ? packageConf.scripts.test
      : packageConf.scripts.test + ' && ' + KARMA_COMMAND;
  }

  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.karma = '^1.7.0';
  packageConf.devDependencies['karma-chrome-launcher'] = '^2.2.0';
  packageConf.devDependencies['karma-firefox-launcher'] = '^1.0.1';

  if (packageConf.metapak.configs.includes('mocha')) {
    packageConf.devDependencies['karma-mocha'] = '^1.3.0';
  }

  return packageConf;
};
