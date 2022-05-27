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
  packageConf.devDependencies.typescript = '^4.7.2';
  packageConf.devDependencies.rimraf = '^3.0.2';

  packageConf.scripts = packageConf.scripts || {};
  packageConf.scripts.build = data.rootPackage
    ? 'lerna run build'
    : "rimraf -f 'dist' && tsc src --outDir dist";

  // Install mandatory scripts
  if (!data.childPackage) {
    packageConf.scripts.precz = ensureScript(
      packageConf.scripts.precz,
      BUILD_COMMAND
    );
    packageConf.scripts.preversion = ensureScript(
      packageConf.scripts.preversion,
      BUILD_COMMAND
    );
  }

  // Remove eventual ol configurations
  delete packageConf.scripts.compile;
  delete packageConf.scripts.module;
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
          ).concat(['typescript', 'rimraf'])
        ),
      ],
    };
  }

  return packageConf;
};
