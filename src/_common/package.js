'use strict';

const GITHUB_REPOSITORY_REGEXP =
  /git\+https:\/\/github.com\/([a-zA-Z0-9\-]+)\/([a-zA-Z0-9\-]+)\.git/;

module.exports = (packageConf) => {
  // Looks like i am the author of all my modules ;)
  packageConf.author = 'Nicolas Froidure';

  // I mostly publish under MIT license, let's default to it
  packageConf.license = 'MIT';

  // Let's always start with the 0.0.0 version
  packageConf.version = packageConf.version || '0.0.0';

  // Supporting Node LTS version only
  packageConf.engines = { node: '>=4.2.0' };

  // Let's add my handy scripts
  packageConf.scripts = packageConf.scripts || {};
  packageConf.scripts.cli = 'env NODE_ENV=${NODE_ENV:-cli}';
  if(packageConf.metapak && packageConf.metapak.data && packageConf.metapak.data.testsFiles) {
    packageConf.scripts.test = 'mocha ' + packageConf.metapak.data.testsFiles;
    packageConf.scripts.coveralls = 'istanbul cover _mocha --report lcovonly -- ' +
      packageConf.metapak.data.testsFiles +
      ' -R spec -t 5000 && cat ./coverage/lcov.info |' +
      ' coveralls && rm -rf ./coverage';
    packageConf.scripts.cover = 'istanbul cover _mocha --report html -- ' +
      packageConf.metapak.data.testsFiles +
      ' -R spec -t 5000';
  }
  if(packageConf.metapak && packageConf.metapak.data && packageConf.metapak.data.files) {
    packageConf.scripts.lint = 'eslint ' + packageConf.metapak.data.files;
  }
  // No tests, no version
  packageConf.scripts.preversion = 'npm t && npm run lint';

  // Add the MUST HAVE dependencies
  packageConf.dependencies = packageConf.dependencies || {};
  packageConf.dependencies.debug = '1.0.0';

  // Add the MUST HAVE dev dependencies
  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.eslint = '3.4.0';
  packageConf.devDependencies['eslint-config-simplifield'] = '4.1.1';
  packageConf.devDependencies.mocha = '3.2.0';
  packageConf.devDependencies['mocha-lcov-reporter'] = '1.2.0';
  packageConf.devDependencies.coveralls = '2.11.15';
  packageConf.devDependencies.istanbul = '0.4.5';

  // This job is already done by NPM, but once, adding to do it on
  // old repositories
  if(packageConf.repository && 'git' === packageConf.repository.type) {
    const [, userName, repositoryName] = GITHUB_REPOSITORY_REGEXP.exec(
      packageConf.repository.url
    ) || [];
    if(userName && repositoryName) {
      packageConf.bugs = packageConf.bugs || {
        url: 'https://github.com/' + userName + '/' + repositoryName + '/issues',
      };
      packageConf.homepage = packageConf.homepage ||
      'https://github.com/' + userName + '/' + repositoryName + '#readme';
    }
  }

  return packageConf;
};
