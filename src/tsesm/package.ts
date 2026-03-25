import { ensureScript } from '../lib.js';
import { type PackageJSONTransformer } from 'metapak';

const BUILD_COMMAND = 'node --run build';

const transformer: PackageJSONTransformer<
  { childPackage?: boolean; rootPackage?: boolean },
  object
> = (packageConf) => {
  const {
    metapak: { data },
  } = packageConf;

  // Declare an ESM module
  packageConf.type = 'module';
  packageConf.main = 'dist/index.js';
  packageConf.types = 'dist/index.d.ts';

  // Add the dev dependencies
  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.typescript = '^6.0.2';
  packageConf.devDependencies.rimraf = '^6.1.3';
  packageConf.devDependencies['@swc/cli'] = '^0.8.0';
  packageConf.devDependencies['@swc/core'] = '^1.15.21';
  packageConf.devDependencies['@swc/helpers'] = '^0.5.19';

  packageConf.scripts = packageConf.scripts || {};
  packageConf.scripts.build = data.rootPackage
    ? 'lerna run build'
    : "rimraf 'dist' && tsc --outDir dist";
  // Currently SWC do not emit types which makes it usefull only
  // to quickly rebuild a module project...
  if (!data.rootPackage) {
    packageConf.scripts.rebuild = 'swc ./src -s -d dist -C jsc.target=es2022';
  }
  packageConf.scripts['types'] = data.rootPackage
    ? 'lerna run type-check'
    : 'tsc --pretty --noEmit';
  delete packageConf.scripts['type-check'];

  // Install mandatory scripts
  if (!data.childPackage) {
    packageConf.scripts.precz = ensureScript(
      packageConf.scripts.precz,
      BUILD_COMMAND,
      'npm run build',
    );
    packageConf.scripts.preversion = ensureScript(
      packageConf.scripts.preversion,
      BUILD_COMMAND,
      'npm run build',
    );
  }

  // Remove eventual old dependencies
  delete packageConf.devDependencies['babel-plugin-knifecycle'];
  Object.keys(packageConf.devDependencies || {}).forEach((key) => {
    if (key.startsWith('@babel')) {
      delete packageConf?.devDependencies?.[key];
    }
  });

  // Remove eventual old configurations
  delete packageConf.module;
  delete packageConf.scripts.compile;
  delete packageConf.scripts['compile:cjs'];
  delete packageConf.scripts['compile:mjs'];
  delete packageConf.scripts.types;

  return packageConf;
};

export default transformer;
