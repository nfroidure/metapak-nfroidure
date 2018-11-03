'use strict';

const { ensureScript, getMetapakInfos } = require('../lib.js');
const ARCHITECTURE_SCRIPT = 'npm run architecture';

module.exports = packageConf => {
  const { data } = getMetapakInfos(packageConf);

  // Adding architecture generation script
  packageConf.scripts = packageConf.scripts || {};
  packageConf.scripts.architecture = data.rootPackage
    ? 'lerna run architecture'
    : 'jsarch ' + data.files + ' > ARCHITECTURE.md && git add ARCHITECTURE.md';

  if (!data.childPackage) {
    packageConf.scripts.precz = ensureScript(
      packageConf.scripts.precz,
      ARCHITECTURE_SCRIPT
    );
    packageConf.scripts.preversion = ensureScript(
      packageConf.scripts.preversion,
      ARCHITECTURE_SCRIPT
    );
  }

  // Add jsarch dep
  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.jsarch = '^1.3.0';

  // Avoid GreenKeeper to update automatically added modules
  if ('metapak-nfroidure' !== packageConf.name && !data.childPackage) {
    packageConf.greenkeeper = {
      ignore: [
        ...new Set(
          (packageConf.greenkeeper && packageConf.greenkeeper.ignore
            ? packageConf.greenkeeper.ignore
            : []
          ).concat(['jsarch'])
        ),
      ],
    };
  }

  return packageConf;
};
