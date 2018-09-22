'use strict';

const { getMetapakData } = require('../lib.js');

module.exports = packageConf => {
  const metapakData = getMetapakData(packageConf);

  if (!metapakData.files) {
    throw new Error('E_NO_FILES');
  }

  packageConf.scripts = packageConf.scripts || {};
  packageConf.scripts.lint = 'eslint ' + metapakData.files;
  packageConf.scripts.prettier = 'prettier --write ' + metapakData.files;

  // Add the MUST HAVE dev dependencies
  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.eslint = '^5.6.0';
  delete packageConf.devDependencies['eslint-config-simplifield'];
  packageConf.devDependencies.prettier = '^1.14.2';
  packageConf.devDependencies['eslint-plugin-prettier'] = '^2.6.2';

  if ('metapak-nfroidure' !== packageConf.name) {
    packageConf.greenkeeper = {
      ignore: (packageConf.greenkeeper && packageConf.greenkeeper.ignore
        ? packageConf.greenkeeper.ignore
        : []
      ).concat(['eslint', 'eslint-config-prettier', 'prettier']),
    };
  }

  return packageConf;
};
