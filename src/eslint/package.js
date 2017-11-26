'use strict';

module.exports = (packageConf) => {
  const metapakData = packageConf.metapak && packageConf.metapak.data ?
    packageConf.metapak.data :
    {};

  if(!metapakData.files) {
    throw new Error('E_NO_FILES');
  }

  packageConf.scripts = packageConf.scripts || {};
  packageConf.scripts.lint = 'eslint ' + metapakData.files;

  // Add the MUST HAVE dev dependencies
  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.eslint = '3.16.0';
  packageConf.devDependencies['eslint-config-simplifield'] = '4.1.1';

  if('metapak-nfroidure' !== packageConf.name) {
    packageConf.greenkeeper = {
      ignore: (
        packageConf.greenkeeper &&
        packageConf.greenkeeper.ignore ?
        packageConf.greenkeeper.ignore :
        []
      ).concat([
        'eslint', 'eslint-config-simplifield',
      ]),
    };
  }

  return packageConf;
};
