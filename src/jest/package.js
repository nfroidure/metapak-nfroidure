'use strict';

const JEST_COMMAND = 'npm run jest';

module.exports = packageConf => {
  // Let's add test scripts
  packageConf.scripts = packageConf.scripts || {};
  packageConf.scripts.jest = 'NODE_ENV=test jest';
  packageConf.scripts.test = packageConf.scripts.test.includes(JEST_COMMAND)
    ? packageConf.scripts.test
    : (packageConf.scripts.test ? packageConf.scripts.test + ' && ' : '') +
      JEST_COMMAND;
  packageConf.scripts.cover = `npm run jest -- --coverage`;
  packageConf.scripts.coveralls =
    'npm run cover && cat ./coverage/lcov.info | coveralls' +
    ' && rm -rf ./coverage';

  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.jest = '^22.4.2';
  packageConf.devDependencies.coveralls = '^3.0.0';

  if ('metapak-nfroidure' !== packageConf.name) {
    packageConf.greenkeeper = {
      ignore: (packageConf.greenkeeper && packageConf.greenkeeper.ignore
        ? packageConf.greenkeeper.ignore
        : []
      ).concat(['jest', 'coveralls', 'istanbul']),
    };
  }

  packageConf.jest = packageConf.jest || {
    coverageReporters: ['lcov'],
    testPathIgnorePatterns: ['/node_modules/'],
  };

  return packageConf;
};
