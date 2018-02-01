'use strict';

module.exports = packageConf => {
  // Let's add test scripts
  packageConf.scripts = packageConf.scripts || {};
  packageConf.scripts.test = 'jest --config=.jest.config.js';
  packageConf.scripts.cover = 'jest --config=.jest.config.js --coverage';
  packageConf.scripts.coveralls =
    'npm run cover && cat ./coverage/lcov.info | coveralls' +
    ' && rm -rf ./coverage';

  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.jest = '^22.1.4';
  packageConf.devDependencies.coveralls = '^3.0.0';
  packageConf.devDependencies.istanbul = '^0.4.5';

  if ('metapak-nfroidure' !== packageConf.name) {
    packageConf.greenkeeper = {
      ignore: (packageConf.greenkeeper && packageConf.greenkeeper.ignore
        ? packageConf.greenkeeper.ignore
        : []
      ).concat(['jest', 'coveralls', 'istanbul']),
    };
  }

  return packageConf;
};
