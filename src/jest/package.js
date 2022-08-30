'use strict';

const { ensureScript } = require('../lib.js');
const { getMetapakInfos } = require('../lib.js');

const JEST_SCRIPT = 'npm run jest';

module.exports = (packageConf) => {
  const { configs, data } = getMetapakInfos(packageConf);
  // Let's add test scripts
  packageConf.scripts = packageConf.scripts || {};
  packageConf.scripts.jest = configs.includes('tsesm')
    ? 'NODE_OPTIONS=--experimental-vm-modules NODE_ENV=test jest'
    : 'NODE_ENV=test jest';
  packageConf.scripts.test = ensureScript(
    packageConf.scripts.test,
    JEST_SCRIPT,
  );
  packageConf.scripts.cover = `npm run jest -- --coverage`;

  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.jest = '^29.0.1';

  // Add coveralls for independant packages
  if (!data.childPackage) {
    packageConf.scripts.coveralls =
      'npm run cover && cat ./coverage/lcov.info | coveralls' +
      ' && rm -rf ./coverage';
    packageConf.devDependencies.coveralls = '^3.1.1';
  }
  packageConf.jest = {
    coverageReporters: ['lcov'],
    testPathIgnorePatterns: ['/node_modules/'],
    roots: data.jestRoots || ['<rootDir>/src'],
    ...packageConf.jest,
    // Add ts esm necessary conf
    ...(configs.includes('tsesm')
      ? {
          transform: {
            '^.+\\.tsx?$': [
              'esbuild-jest',
              {
                sourcemap: true,
                format: 'esm',
              },
            ],
          },
          testEnvironment: 'node',
          moduleNameMapper: {
            ...((packageConf.jest || {}).moduleNameMapper || {}),
            '(.+)\\.js': '$1',
          },
          extensionsToTreatAsEsm: ['.ts'],
          preset: {}.undef,
          globals: {}.undef,
        }
      : {}),
  };
  // Special configuration for TypeScript
  if (configs.includes('typescript') || configs.includes('tsesm')) {
    delete packageConf.devDependencies['@types/jest'];
    delete packageConf.dependencies['@types/jest'];
  }
  if (configs.includes('tsesm')) {
    delete packageConf.devDependencies['ts-jest'];
    packageConf.devDependencies['esbuild'] = '^0.15.6';
    packageConf.devDependencies['esbuild-jest'] = '^0.5.0';
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
                packageName !== 'ts-jest' || configs.includes('tsesm'),
            ),
        ),
      ],
    };
  }

  return packageConf;
};
