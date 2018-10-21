'use strict';

const { getMetapakInfos } = require('../lib.js');

module.exports = packageConf => {
  const { data } = getMetapakInfos(packageConf);

  if (!data.files) {
    throw new Error('E_NO_FILES');
  }

  packageConf.scripts = packageConf.scripts || {};
  packageConf.scripts.lint = 'eslint ' + data.files;
  packageConf.scripts.prettier = 'prettier --write ' + data.files;

  // Add the MUST HAVE dev dependencies
  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.eslint = '^5.7.0';
  delete packageConf.devDependencies['eslint-config-simplifield'];
  packageConf.devDependencies.prettier = '^1.14.3';
  packageConf.devDependencies['eslint-plugin-prettier'] = '^3.0.0';

  if ('metapak-nfroidure' !== packageConf.name) {
    packageConf.greenkeeper = {
      ignore: [
        ...new Set(
          (packageConf.greenkeeper && packageConf.greenkeeper.ignore
            ? packageConf.greenkeeper.ignore
            : []
          ).concat(['eslint', 'eslint-config-prettier', 'prettier'])
        ),
      ],
    };
  }

  return packageConf;
};
