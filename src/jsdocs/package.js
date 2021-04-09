'use strict';

const { ensureScript, getMetapakInfos } = require('../lib.js');
const { apiPath } = require('../config.js');

const DOCUMENTATION_SCRIPT = 'npm run doc';

module.exports = (packageConf) => {
  const { configs, data } = getMetapakInfos(packageConf);

  // Adding documentation generation script
  packageConf.scripts = packageConf.scripts || {};
  packageConf.scripts.doc = data.rootPackage
    ? 'lerna run doc'
    : `echo "# API" > ${apiPath}; jsdoc2md ${
        configs.includes('typescript') ? data.distFiles : data.files
      } >> ${apiPath} && git add ${apiPath}`;

  if (!data.childPackage) {
    packageConf.scripts.precz = ensureScript(
      packageConf.scripts.precz,
      DOCUMENTATION_SCRIPT
    );
    packageConf.scripts.preversion = ensureScript(
      packageConf.scripts.preversion,
      DOCUMENTATION_SCRIPT
    );
  }

  // Add doc deps
  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies['jsdoc-to-markdown'] = '^7.0.1';

  // Avoid GreenKeeper to update automatically added modules
  if ('metapak-nfroidure' !== packageConf.name && !data.childPackage) {
    packageConf.greenkeeper = {
      ignore: [
        ...new Set(
          (packageConf.greenkeeper && packageConf.greenkeeper.ignore
            ? packageConf.greenkeeper.ignore
            : []
          ).concat(['jsdoc-to-markdown'])
        ),
      ],
    };
  }

  return packageConf;
};
