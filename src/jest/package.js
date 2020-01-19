'use strict';

const { ensureScript } = require('../lib.js');
const { getMetapakInfos } = require('../lib.js');

const JEST_SCRIPT = 'npm run jest';

module.exports = packageConf => {
  const { configs, data } = getMetapakInfos(packageConf);
  // Let's add test scripts
  packageConf.scripts = packageConf.scripts || {};
  packageConf.scripts.jest = 'NODE_ENV=test jest';
  packageConf.scripts.test = ensureScript(
    packageConf.scripts.test,
    JEST_SCRIPT
  );
  packageConf.scripts.cover = `npm run jest -- --coverage`;

  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.jest = '^24.9.0';

  // Add coveralls for independant packages
  if (!data.childPackage) {
    packageConf.scripts.coveralls =
      'npm run cover && cat ./coverage/lcov.info | coveralls' +
      ' && rm -rf ./coverage';
    packageConf.devDependencies.coveralls = '^3.0.9';
  }
  packageConf.jest = Object.assign(
    {
      coverageReporters: ['lcov'],
      testPathIgnorePatterns: ['/node_modules/'],
      roots: data.jestRoots || ['<rootDir>/src'],
    },
    // Remove no longer needed ts conf
    configs.includes('typescript')
      ? {
          testRegex: {}.undef,
          moduleFileExtensions: {}.undef,
          transform: {}.undef,
        }
      : {},

    packageConf.jest
  );
  // Special configuration for TypeScript
  if (configs.includes('typescript')) {
    packageConf.devDependencies['@types/jest'] = '^24.9.0';
  }

  if (configs.includes('typescript')) {
    delete packageConf.devDependencies['ts-jest'];
  }

  if ('metapak-nfroidure' !== packageConf.name && !data.childPackage) {
    packageConf.greenkeeper = {
      ignore: [
        ...new Set(
          (packageConf.greenkeeper && packageConf.greenkeeper.ignore
            ? packageConf.greenkeeper.ignore
            : []
          )
            .concat(['jest', 'coveralls'])
            .filter(packageName => packageName !== 'ts-jest')
        ),
      ],
    };
  }

  return packageConf;
};
