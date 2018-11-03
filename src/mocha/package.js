'use strict';

const YError = require('yerror');
const { getMetapakInfos } = require('../lib.js');

const MOCHA_COMMAND = 'npm run mocha';

module.exports = packageConf => {
  const { configs, data } = getMetapakInfos(packageConf);

  if (!data.testsFiles) {
    throw new Error('E_NO_TEST_FILES', packageConf.metapak);
  }

  packageConf.scripts = packageConf.scripts || {};
  if (configs.includes('babel')) {
    if (configs.indexOf('babel') > configs.indexOf('mocha')) {
      throw new YError('E_BAD_CONFIG_ORDER', 'babel', 'mocha');
    }
    packageConf.scripts.mocha = `mocha --require '@babel/register' ${
      data.testsFiles
    }`;
  } else {
    packageConf.scripts.mocha = `mocha ${data.testsFiles}`;
  }

  packageConf.scripts.test = packageConf.scripts.test.includes(MOCHA_COMMAND)
    ? packageConf.scripts.test
    : packageConf.scripts.test + ' && ' + MOCHA_COMMAND;
  packageConf.scripts.coveralls =
    'nyc npm test && nyc report --reporter=text-lcov | coveralls && rm -rf ./coverage';
  packageConf.scripts.cover =
    'nyc npm test && nyc report --reporter=html --reporter=text';

  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.mocha = '^5.2.0';
  packageConf.devDependencies.coveralls = '^3.0.2';
  packageConf.devDependencies.nyc = '^13.0.1';

  delete packageConf.devDependencies['mocha-lcov-reporter'];
  delete packageConf.devDependencies.istanbul;

  if ('metapak-nfroidure' !== packageConf.name && !data.childPackage) {
    packageConf.greenkeeper = {
      ignore: [
        ...new Set(
          (packageConf.greenkeeper && packageConf.greenkeeper.ignore
            ? packageConf.greenkeeper.ignore
            : []
          ).concat(['mocha', 'coveralls', 'nyc'])
        ),
      ],
    };
  }

  return packageConf;
};
