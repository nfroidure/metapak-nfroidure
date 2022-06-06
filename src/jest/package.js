'use strict';

const { ensureScript } = require('../lib.js');
const { getMetapakInfos } = require('../lib.js');

const JEST_SCRIPT = 'npm run jest';

module.exports = (packageConf) => {
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
  packageConf.devDependencies.jest = '^28.1.0';

  // Add coveralls for independant packages
  if (!data.childPackage) {
    packageConf.scripts.coveralls =
      'npm run cover && cat ./coverage/lcov.info | coveralls' +
      ' && rm -rf ./coverage';
    packageConf.devDependencies.coveralls = '^3.1.1';
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
    // Add ts esm necessary conf
    configs.includes('tsesm')
      ? {
          preset: 'ts-jest',
          testEnvironment: 'node',
          transform: {
            '\\.[jt]sx?$': 'ts-jest',
          },
          globals: {
            'ts-jest': {
              useESM: true,
            },
          },
          moduleNameMapper: {
            '(.+)\\.js': '$1',
          },
          extensionsToTreatAsEsm: ['.ts'],
        }
      : {},

    packageConf.jest
  );
  // Special configuration for TypeScript
  if (configs.includes('typescript') || configs.includes('tsesm')) {
    packageConf.devDependencies['@types/jest'] = '^28.1.1';
  }
  if (configs.includes('tsesm')) {
    packageConf.devDependencies['ts-jest'] = '^28.0.4';
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
            .filter(
              (packageName) =>
                packageName !== 'ts-jest' || configs.includes('tsesm')
            )
        ),
      ],
    };
  }

  return packageConf;
};
