'use strict';

const { ensureScript } = require('../lib.js');
const { getMetapakInfos } = require('../lib.js');

const JEST_SCRIPT = 'npm run jest';

module.exports = packageConf => {
  const { data } = getMetapakInfos(packageConf);
  // Let's add test scripts
  packageConf.scripts = packageConf.scripts || {};
  packageConf.scripts.jest = 'NODE_ENV=test jest';
  packageConf.scripts.test = ensureScript(
    packageConf.scripts.test,
    JEST_SCRIPT
  );
  packageConf.scripts.cover = `npm run jest -- --coverage`;
  packageConf.scripts.coveralls =
    'npm run cover && cat ./coverage/lcov.info | coveralls' +
    ' && rm -rf ./coverage';

  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.jest = '^23.6.0';
  packageConf.devDependencies.coveralls = '^3.0.2';

  if ('metapak-nfroidure' !== packageConf.name) {
    packageConf.greenkeeper = {
      ignore: [
        ...new Set(
          (packageConf.greenkeeper && packageConf.greenkeeper.ignore
            ? packageConf.greenkeeper.ignore
            : []
          ).concat(['jest', 'coveralls'])
        ),
      ],
    };
  }

  packageConf.jest = packageConf.jest || {
    coverageReporters: ['lcov'],
    testPathIgnorePatterns: ['/node_modules/'],
    roots: data.jestRoots || ['<rootDir>/src'],
  };

  return packageConf;
};
