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
  packageConf.devDependencies.typescript = '^5.4.5';
  packageConf.devDependencies.rimraf = '^5.0.7';
  packageConf.devDependencies['@swc/cli'] = '^0.3.12';
  packageConf.devDependencies['@swc/core'] = '^1.5.7';
  packageConf.devDependencies['@swc/helpers'] = '^0.5.11';

  packageConf.scripts = packageConf.scripts || {};
  packageConf.scripts.build = data.rootPackage
    ? 'lerna run build'
    : "rimraf 'dist' && tsc --outDir dist";
  // Currently SWC do not emit types which makes it usefull only
  // to quickly rebuild a module project...
  if (!data.rootPackage) {
    packageConf.scripts.rebuild = 'swc ./src -s -d dist -C jsc.target=es2022';
  }
  packageConf.scripts['type-check'] = data.rootPackage
    ? 'lerna run type-check'
    : 'tsc --pretty --noEmit';

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
