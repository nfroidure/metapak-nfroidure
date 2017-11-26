'use strict';

module.exports = (packageConf) => {
  const metapakData = packageConf.metapak && packageConf.metapak.data ?
    packageConf.metapak.data :
    {};

  if(!metapakData.testsFiles) {
    throw new Error('E_NO_TEST_FILES', packageConf.metapak);
  }

  packageConf.scripts = packageConf.scripts || {};
  packageConf.scripts.test = 'mocha ' + metapakData.testsFiles;
  packageConf.scripts.coveralls =
    'istanbul cover _mocha --report lcovonly' +
    ' -- ' + metapakData.testsFiles + ' -R spec -t 5000' +
    ' && cat ./coverage/lcov.info | coveralls' +
    ' && rm -rf ./coverage';
  packageConf.scripts.cover =
    'istanbul cover _mocha --report html' +
    ' -- ' + metapakData.testsFiles + ' -R spec -t 5000';

  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.mocha = '3.2.0';
  packageConf.devDependencies['mocha-lcov-reporter'] = '1.3.0';
  packageConf.devDependencies.coveralls = '2.11.15';
  packageConf.devDependencies.istanbul = '0.4.5';

  if('metapak-nfroidure' !== packageConf.name) {
    packageConf.greenkeeper = {
      ignore: (
        packageConf.greenkeeper &&
        packageConf.greenkeeper.ignore ?
        packageConf.greenkeeper.ignore :
        []
      ).concat([
        'mocha', 'mocha-lcov-reporter',
        'coveralls', 'istanbul',
      ]),
    };
  }

  return packageConf;
};
