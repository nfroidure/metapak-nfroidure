'use strict';

const YError = require('yerror');
const { getMetapakInfos } = require('../lib.js');

const KARMA_COMMAND = 'npm run karma';

module.exports = packageConf => {
  const { configs, data } = getMetapakInfos(packageConf);

  // Add packages
  const packagesAdded = [
    'karma',
    'karma-chrome-launcher',
    'karma-firefox-launcher',
  ];

  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.karma = '^3.0.0';
  packageConf.devDependencies['karma-chrome-launcher'] = '^2.2.0';
  packageConf.devDependencies['karma-firefox-launcher'] = '^1.1.0';

  if (configs.includes('mocha')) {
    if (configs.indexOf('mocha') > configs.indexOf('karma')) {
      throw new YError('E_BAD_CONFIG_ORDER', 'karma', 'mocha');
    }
    packageConf.devDependencies['karma-mocha'] = '^1.3.0';
    packagesAdded.push('karma-mocha');
  }

  // Adapting script to work with Babel
  packageConf.scripts = packageConf.scripts || {};
  if (data.testsFiles) {
    packageConf.scripts.karma = 'karma start karma.conf.js';
    packageConf.scripts.test = packageConf.scripts.test.includes(KARMA_COMMAND)
      ? packageConf.scripts.test
      : packageConf.scripts.test + ' && ' + KARMA_COMMAND;
  }

  // Declaring added package to green keeper
  if ('metapak-nfroidure' !== packageConf.name && !data.childPackage) {
    packageConf.greenkeeper = {
      ignore: [
        ...new Set(
          (packageConf.greenkeeper && packageConf.greenkeeper.ignore
            ? packageConf.greenkeeper.ignore
            : []
          ).concat(packagesAdded)
        ),
      ],
    };
  }

  return packageConf;
};
