'use strict';

const { ensureScript, getMetapakInfos } = require('../lib.js');
const BUILD_COMMAND = 'npm run build';

module.exports = (packageConf) => {
  const { data } = getMetapakInfos(packageConf);

  // Declare an ESM module
  packageConf.type = 'module';
  packageConf.main = 'dist/index.js';
  packageConf.types = 'dist/index.d.ts';

  // Add the dev dependencies
  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.typescript = '^4.8.2';
  packageConf.devDependencies.rimraf = '^3.0.2';

  packageConf.scripts = packageConf.scripts || {};
  packageConf.scripts.build = data.rootPackage
    ? 'lerna run build'
    : "rimraf -f 'dist' && tsc --outDir dist";

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
      delete packageConf.devDependencies[key];
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
          (packageConf.greenkeeper && packageConf.greenkeeper.ignore
            ? packageConf.greenkeeper.ignore
            : []
          ).concat(['typescript', 'rimraf']),
        ),
      ],
    };
  }

  return packageConf;
};
