import { ensureScript } from '../lib.js';
import type { PackageJSONTransformer } from 'metapak';

const JEST_SCRIPT = 'npm run jest';

const transformer: PackageJSONTransformer<
  { childPackage?: boolean; rootPackage?: boolean; jestRoots?: string[] },
  {
    greenkeeper?: { ignore?: string[] };
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
    JEST_SCRIPT,
  );
  packageConf.scripts.cover = `npm run jest -- --coverage`;

  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.jest = '^29.5.0';

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
  } as any;
  // Special configuration for TypeScript
  if (configs.includes('typescript') || configs.includes('tsesm')) {
    delete packageConf?.devDependencies?.['@types/jest'];
    delete packageConf?.dependencies?.['@types/jest'];
  }
  if (configs.includes('tsesm')) {
    delete packageConf.devDependencies['ts-jest'];
    delete packageConf.devDependencies['esbuild'];
    delete packageConf.devDependencies['esbuild-jest'];
    packageConf.devDependencies['@swc/jest'] = '^0.2.26';
  }

  if (configs.includes('typescript')) {
    delete packageConf.devDependencies['ts-jest'];
  }

  if ('metapak-nfroidure' !== packageConf.name && !data.childPackage) {
    packageConf.greenkeeper = {
      ignore: [
        ...new Set(
          (packageConf?.greenkeeper?.ignore || [])
            .concat(['jest', 'coveralls', '@swc/jest'])
            .filter((dependency) => packageConf?.devDependencies?.[dependency]),
        ),
      ],
    };
  }

  return packageConf;
};

export default transformer;
