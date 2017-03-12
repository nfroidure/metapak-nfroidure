'use strict';

module.exports = (packageConf) => {
  const metapakData = packageConf.metapak && packageConf.metapak.data ?
    packageConf.metapak.data :
    {};

  // Adding documentation generation script
  packageConf.scripts = packageConf.scripts || {};
  packageConf.scripts.architecture = 'jsarch ' + metapakData.files + ' > ARCHITECTURE.md';
  // Add doc deps
  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.mermaid = '^7.0.0';
  packageConf.devDependencies.phantomjs = '^2.1.7';
  packageConf.devDependencies.jsarch = '1.1.1';

  // Avoid GreenKeeper to update automatically added modules
  if('metapak-nfroidure' !== packageConf.name) {
    packageConf.greenkeeper.ignore = packageConf.greenkeeper.ignore.concat([
      'mermaid',
      'phantomjs',
      'jsarch',
    ]);
  }

  return packageConf;
};
