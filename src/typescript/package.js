'use strict';

const YError = require('yerror');
const { ensureScript, getMetapakInfos } = require('../lib.js');
const TYPES_COMMAND = 'npm run types';

module.exports = packageConf => {
  const { data } = getMetapakInfos(packageConf);

  // Add the dev dependencies
  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.typescript = '^3.7.2';

  packageConf.scripts = packageConf.scripts || {};
  packageConf.scripts.types = data.rootPackage
    ? 'lerna run types'
    : "rimraf -f 'dist/**/*.d.ts' && tsc --project . --declaration --emitDeclarationOnly --outDir dist";

  if (!data.rootPackage && !packageConf.types) {
    throw new YError('E_TYPES_NOT_DECLARED');
  }
  if (!data.childPackage) {
    packageConf.scripts.precz = ensureScript(
      packageConf.scripts.precz,
      TYPES_COMMAND
    );
    packageConf.scripts.preversion = ensureScript(
      packageConf.scripts.preversion,
      TYPES_COMMAND
    );
  }

  // Avoid GreenKeeper to update automatically added modules
  if ('metapak-nfroidure' !== packageConf.name && !data.childPackage) {
    packageConf.greenkeeper = {
      ignore: [
        ...new Set(
          (packageConf.greenkeeper && packageConf.greenkeeper.ignore
            ? packageConf.greenkeeper.ignore
            : []
          ).concat(['typescript'])
        ),
      ],
    };
  }

  return packageConf;
};
