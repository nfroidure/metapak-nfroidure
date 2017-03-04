'use strict';

const config = require('../config.js');

const GITHUB_REPOSITORY_REGEXP =
  /git\+https:\/\/github.com\/([a-zA-Z0-9\-]+)\/([a-zA-Z0-9\-]+)\.git/;

module.exports = (packageConf) => {
  const metapakData = packageConf.metapak && packageConf.metapak.data ?
    packageConf.metapak.data :
    {};

  // Looks like i am the author of all my modules ;)
  packageConf.author = 'Nicolas Froidure';

  // I mostly publish under MIT license, let's default to it
  packageConf.license = 'MIT';

  // Let's always start with the 0.0.0 version
  packageConf.version = packageConf.version || '0.0.0';

  // Supporting Node LTS version only
  packageConf.engines = { node: '>=' + config.lastNodeLTS };

  // Let's add my handy scripts
  packageConf.scripts = packageConf.scripts || {};

  // I like this, it enable me to run arbitrary npm binary
  // without having global modules
  packageConf.scripts.cli = 'env NODE_ENV=${NODE_ENV:-cli}';

  // Lets use commitizen
  packageConf.scripts.cz = 'env NODE_ENV=${NODE_ENV:-cli} git cz';
  packageConf.config = {
    commitizen: {
      path: './node_modules/cz-conventional-changelog',
    },
  };

  // Add the changelog stuffs
  packageConf.scripts.changelog = 'conventional-changelog -p angular -i CHANGELOG.md -s';
  packageConf.scripts.version = 'npm run changelog && git add CHANGELOG.md';

  // If testsFiles are declared, this set up the whole code
  // quality measuring tools
  if(metapakData.testsFiles) {
    packageConf.scripts.test = 'mocha ' + metapakData.testsFiles;
    packageConf.scripts.coveralls =
      'istanbul cover _mocha --report lcovonly' +
      ' -- ' + metapakData.testsFiles + ' -R spec -t 5000' +
      ' && cat ./coverage/lcov.info | coveralls' +
      ' && rm -rf ./coverage';
    packageConf.scripts.cover =
      'istanbul cover _mocha --report html' +
      ' -- ' + metapakData.testsFiles + ' -R spec -t 5000';
  }

  // Linting every declared files
  if(metapakData.files) {
    packageConf.scripts.lint = 'eslint ' + metapakData.files;
  }

  // No tests, no version: Even when there is no test files
  // i should never create versions without tests, this acts
  // like a reminder
  packageConf.scripts.preversion = 'npm t && npm run lint';

  // Add the MUST HAVE dependencies:
  packageConf.dependencies = packageConf.dependencies || {};
  // debug is really nice, all my modules should use it,
  // it makes debugging so simple
  packageConf.dependencies.debug = '2.6.1';

  // Add the MUST HAVE dev dependencies
  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.eslint = '3.16.0';
  packageConf.devDependencies['eslint-config-simplifield'] = '4.1.1';
  packageConf.devDependencies.mocha = '3.2.0';
  packageConf.devDependencies['mocha-lcov-reporter'] = '1.3.0';
  packageConf.devDependencies.coveralls = '2.11.15';
  packageConf.devDependencies.istanbul = '0.4.5';
  packageConf.devDependencies.commitizen = '^2.9.6';
  packageConf.devDependencies['cz-conventional-changelog'] = '^2.0.0';
  packageConf.devDependencies['conventional-changelog-cli'] = '^1.2.0';

  // Avoid GreenKeeper to update automatically added modules
  // except for this module so that we still benefit from
  // greenkeeper but once to avoid PR spam ;)
  if('metapak-nfroidure' !== packageConf.name) {
    packageConf.greenkeeper = {
      ignore: [
        'debug',
        'eslint', 'eslint-config-simplifield', 'mocha',
        'mocha-lcov-reporter', 'commitizen', 'cz-conventional-changelog',
        'coveralls', 'istanbul', 'conventional-changelog-cli',
      ],
    };
  }

  // This job is already done by NPM, but once,.
  // This allows to do it on old repositories
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
