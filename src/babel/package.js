'use strict';

const config = require('../config.js');
const COMPILE_COMMAND = 'npm run compile';
const DEFAULT_BABEL_CONFIG = {
  presets: [
    [
      'env',
      {
        targets: {
          node: config.lastNodeLTS,
        },
      },
    ],
  ],
  plugins: ['transform-object-rest-spread'],
};

module.exports = packageConf => {
  const metapakData =
    packageConf.metapak && packageConf.metapak.data
      ? packageConf.metapak.data
      : {};

  // Add Babel config
  packageConf.babel = packageConf.babel
    ? packageConf.babel
    : DEFAULT_BABEL_CONFIG;

  // Adapting script to work with Babel
  packageConf.scripts = packageConf.scripts || {};
  packageConf.scripts.cli = 'env NODE_ENV=${NODE_ENV:-cli}';
  if (packageConf.metapak.configs.includes('jsdocs')) {
    packageConf.devDependencies['jsdoc-to-markdown'] = '^3.1.0-0';
  }
  if (packageConf.metapak.configs.includes('mocha')) {
    packageConf.scripts.mocha =
      'mocha --compilers js:babel-register' + ' ' + metapakData.testsFiles;
    packageConf.scripts.coveralls =
      'istanbul cover _mocha --report lcovonly --' +
      ' --compilers js:babel-register' +
      ' ' +
      metapakData.testsFiles +
      ' -R spec -t 5000' +
      ' && cat ./coverage/lcov.info' +
      ' | coveralls' +
      ' && rm -rf ./coverage';
    packageConf.scripts.cover =
      'istanbul cover _mocha --report html --' +
      ' --compilers js:babel-register' +
      ' ' +
      metapakData.testsFiles +
      ' -R spec -t 5000';
    packageConf.devDependencies.istanbul = '^1.0.0-alpha.2';
  }

  // Adding Babel compile script
  packageConf.scripts.compile = 'babel src --out-dir=dist';

  // We have to compile with Babel before pushing a version
  packageConf.scripts.preversion = packageConf.scripts.preversion.includes(
    COMPILE_COMMAND
  )
    ? packageConf.scripts.preversion
    : packageConf.scripts.preversion + ' && ' + COMPILE_COMMAND;

  packageConf.devDependencies = packageConf.devDependencies || {};
  delete packageConf.devDependencies[
    'babel-plugin-transform-async-to-module-method'
  ];
  delete packageConf.devDependencies['babel-cli'];
  delete packageConf.devDependencies['babel-core'];
  delete packageConf.devDependencies['babel-register'];
  delete packageConf.devDependencies['babel-preset-env'];
  delete packageConf.devDependencies[
    'babel-plugin-transform-object-rest-spread'
  ];
  delete packageConf.devDependencies['babel-eslint'];

  // Istanbul needs a specific version to work with babel
  if (
    packageConf.devDependencies.istanbul ||
    (metapakData.configs || []).includes('mocha')
  ) {
    packageConf.devDependencies.istanbul = '^1.0.0-alpha.2';
  } else if ((metapakData.configs || []).includes('jest')) {
    delete packageConf.devDependencies.istanbul;
  }

  // Jest needs an additionnal module to work with babel
  if (
    packageConf.devDependencies.istanbul ||
    (metapakData.configs || []).includes('mocha')
  ) {
    packageConf.devDependencies['babel-core'] = '^7.0.0-0';
  }

  packageConf.devDependencies['@babel/cli'] = '^7.0.0';
  packageConf.devDependencies['@babel/core'] = '^7.0.1';
  packageConf.devDependencies['@babel/register'] = '^7.0.0';
  packageConf.devDependencies['@babel/preset-env'] = '^7.0.0';
  packageConf.devDependencies['@babel/plugin-proposal-object-rest-spread'] =
    '^6.26.0';
  packageConf.devDependencies['babel-eslint'] = '^9.0.0';

  return packageConf;
};
