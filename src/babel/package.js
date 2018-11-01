'use strict';

const YError = require('yerror');
const config = require('../config.js');
const { getMetapakInfos } = require('../lib.js');
const COMPILE_COMMAND = 'npm run compile';
const DEFAULT_BABEL_CONFIG = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          node: config.lastNodeLTS,
        },
      },
    ],
  ],
  plugins: ['@babel/plugin-proposal-object-rest-spread'],
};

module.exports = packageConf => {
  const { configs } = getMetapakInfos(packageConf);

  // Add Babel config
  packageConf.babel = packageConf.babel
    ? packageConf.babel
    : DEFAULT_BABEL_CONFIG;

  // Fix existing babel config
  packageConf.babel.presets = packageConf.babel.presets.map(
    ([presetName, ...presetArgs]) =>
      presetName === 'env'
        ? ['@babel/env', ...presetArgs]
        : [presetName, ...presetArgs]
  );
  packageConf.babel.plugins = packageConf.babel.plugins.map(
    plugin =>
      plugin === 'transform-object-rest-spread'
        ? '@babel/plugin-proposal-object-rest-spread'
        : plugin
  );

  // Adapting script to work with Babel
  packageConf.scripts = packageConf.scripts || {};
  packageConf.scripts.cli = 'env NODE_ENV=${NODE_ENV:-cli}';

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

  // Istanbul needed a specific version to work with babel
  // but let's remove it snce we do not use it anymore
  delete packageConf.devDependencies.istanbul;

  // Jest needs an additionnal module to work with babel
  if (configs.includes('jest')) {
    packageConf.devDependencies['babel-core'] = '^7.0.0-0';
  }

  packageConf.devDependencies['@babel/cli'] = '^7.1.2';
  packageConf.devDependencies['@babel/core'] = '^7.1.2';
  packageConf.devDependencies['@babel/register'] = '^7.0.0';
  packageConf.devDependencies['@babel/preset-env'] = '^7.1.0';
  packageConf.devDependencies['@babel/plugin-proposal-object-rest-spread'] =
    '^7.0.0';

  // Add ESLint tweaks
  if (configs.includes('eslint')) {
    if (configs.indexOf('eslint') > configs.indexOf('babel')) {
      throw new YError('E_BAD_CONFIG_ORDER', 'babel', 'eslint');
    }
    packageConf.devDependencies['babel-eslint'] = '^10.0.1';
    packageConf.eslintConfig = {
      extends: 'eslint:recommended',
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        modules: true,
      },
      env: {
        es6: true,
        node: true,
        jest: true,
        mocha: true,
      },
      plugins: ['prettier'],
      rules: {
        'prettier/prettier': 'error',
      },
    };
    packageConf.prettier = {
      semi: true,
      printWidth: 80,
      singleQuote: true,
      trailingComma: 'all',
      proseWrap: 'always',
    };
  }

  return packageConf;
};
