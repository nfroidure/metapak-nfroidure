import { ensureScript } from '../lib.js';
import { type PackageJSONTransformer } from 'metapak';
import { type Config } from 'jest';

const transformer: PackageJSONTransformer<
  { childPackage?: boolean; rootPackage?: boolean; jestRoots?: string[] },
  {
    jest?: Config;
  }
> = (packageConf) => {
  const {
    metapak: { data, configs },
  } = packageConf;

  // Let's add test scripts
  packageConf.scripts = packageConf.scripts || {};
  packageConf.scripts.jest = configs.includes('tsesm')
    ? 'NODE_OPTIONS=--experimental-vm-modules NODE_ENV=test jest'
    : 'NODE_ENV=test jest';
  packageConf.scripts.test = ensureScript(
    packageConf.scripts.test,
    'node --run jest',
    'npm run jest',
  );
  packageConf.scripts.cover = `node --run jest -- --coverage`;

  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.jest = '^30.3.0';

  // Remove old coveralls configs
  delete packageConf.scripts.coveralls;
  delete packageConf.devDependencies.coveralls;

  packageConf.jest = {
    coverageReporters: ['lcov'],
    testPathIgnorePatterns: ['/node_modules/'],
    roots: data.jestRoots || ['<rootDir>/src'],
    ...(typeof packageConf.jest === 'object' ? packageConf.jest : {}),
    // Add ts esm necessary conf
    ...(configs.includes('tsesm')
      ? {
          transform: {
            '^.+\\.tsx?$': ['@swc/jest', {}],
          },
          testEnvironment: 'node',
          moduleNameMapper: {
            ...(packageConf.jest &&
            typeof packageConf.jest === 'object' &&
            'moduleNameMapper' in packageConf.jest &&
            typeof packageConf.jest?.moduleNameMapper === 'object'
              ? packageConf.jest?.moduleNameMapper
              : {}),
            '(.+)\\.js': '$1',
          },
          extensionsToTreatAsEsm: ['.ts'],
          preset: undefined,
          globals: undefined,
        }
      : {}),
  };

  // Jest lesser than v30 was not compatible with prettier v3
  // Let's remove this tweak now that is is supported
  // https://github.com/jestjs/jest/issues/14305
  if ('prettierPath' in packageConf.jest) {
    delete packageConf.jest.prettierPath;
  }

  // Special configuration for TypeScript
  if (configs.includes('tsesm')) {
    delete packageConf.devDependencies['ts-jest'];
    delete packageConf.devDependencies['esbuild'];
    delete packageConf.devDependencies['esbuild-jest'];
    packageConf.devDependencies['@swc/jest'] = '^0.2.39';
  }

  return packageConf;
};

export default transformer;
