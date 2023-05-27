import { ensureScript } from '../lib.js';
import type { PackageJSONTransformer } from 'metapak';

const BUILD_COMMAND = 'npm run build';

const transformer: PackageJSONTransformer<
  { childPackage?: boolean; rootPackage?: boolean },
  {
    greenkeeper?: { ignore?: string[] };
  }
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
  packageConf.devDependencies.typescript = '^5.0.4';
  packageConf.devDependencies.rimraf = '^5.0.1';
  packageConf.devDependencies['@swc/cli'] = '^0.1.62';
  packageConf.devDependencies['@swc/core'] = '^1.3.60';
  packageConf.devDependencies['@swc/helpers'] = '^0.5.1';

  packageConf.scripts = packageConf.scripts || {};
  packageConf.scripts.build = data.rootPackage
    ? 'lerna run build'
    : "rimraf 'dist' && swc ./src -s -d dist";

  // Install mandatory scripts
  if (!data.childPackage) {
    packageConf.scripts.precz = ensureScript(
      packageConf.scripts.precz,
      BUILD_COMMAND,
    );
    packageConf.scripts.preversion = ensureScript(
      packageConf.scripts.preversion,
      BUILD_COMMAND,
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

  // Avoid GreenKeeper to update automatically added modules
  if ('metapak-nfroidure' !== packageConf.name && !data.childPackage) {
    packageConf.greenkeeper = {
      ignore: [
        ...new Set(
          (packageConf?.greenkeeper?.ignore || []).concat([
            'typescript',
            'rimraf',
            '@swc/cli',
            '@swc/core',
            '@swc/helpers',
          ]),
        ),
      ].filter((dependency) => packageConf?.devDependencies?.[dependency]),
    };
  }

  return packageConf;
};

export default transformer;
