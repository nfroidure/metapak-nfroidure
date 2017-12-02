'use strict';

const COMPILE_COMMAND = 'npm run compile';

module.exports = packageConf => {
  const metapakData =
    packageConf.metapak && packageConf.metapak.data
      ? packageConf.metapak.data
      : {};

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

  // Istanbul needs a specific version to work with babel
  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.istanbul = '^1.0.0-alpha.2';
  packageConf.devDependencies['babel-cli'] = '^6.26.0';
  packageConf.devDependencies['babel-eslint'] = '^7.1.0';
  packageConf.devDependencies['babel-plugin-transform-async-to-module-method'] =
    '^6.24.1';
  packageConf.devDependencies['babel-plugin-transform-object-rest-spread'] =
    '^6.26.0';
  packageConf.devDependencies['babel-preset-env'] = '^1.6.1';
  packageConf.devDependencies['babel-register'] = '^6.9.0';

  return packageConf;
};
