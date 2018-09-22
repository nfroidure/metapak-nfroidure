'use strict';

const config = require('../config.js');
const { ensureScript } = require('../lib.js');

const GITHUB_REPOSITORY_REGEXP = /git\+https:\/\/github.com\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\.git/;
const TEST_SCRIPT = 'npm t';
const LINT_SCRIPT = 'npm run lint';
const METAPAK_SCRIPT = 'npm run metapak -- -s';

module.exports = packageConf => {
  // Looks like i am the author of all my modules ;)
  packageConf.author = {
    name: 'Nicolas Froidure',
    email: 'nicolas.froidure@insertafter.com',
    url: 'http://insertafter.com/en/index.html',
  };

  // Add an empty contributors field
  packageConf.contributors = [];

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

  // Add default scripts to warn they should be there
  if (!packageConf.scripts.test) {
    packageConf.scripts.test = 'echo "WARNING: No tests specified"';
  }
  if (!packageConf.scripts.lint) {
    packageConf.scripts.lint = 'echo "WARNING: No linter specified"';
  }

  // Let's use commitizen
  packageConf.scripts.cz = 'env NODE_ENV=${NODE_ENV:-cli} git cz';
  packageConf.scripts.precz = ensureScript(
    packageConf.scripts.precz,
    TEST_SCRIPT
  );
  packageConf.scripts.precz = ensureScript(
    packageConf.scripts.precz,
    LINT_SCRIPT
  );
  packageConf.scripts.precz = ensureScript(
    packageConf.scripts.precz,
    METAPAK_SCRIPT
  );
  packageConf.config = {
    commitizen: {
      path: './node_modules/cz-conventional-changelog',
    },
  };

  // Add the changelog stuffs
  packageConf.scripts.changelog =
    'conventional-changelog -p angular -i CHANGELOG.md -s';
  packageConf.scripts.version = 'npm run changelog && git add CHANGELOG.md';
  packageConf.scripts.preversion = ensureScript(
    packageConf.scripts.preversion,
    TEST_SCRIPT
  );
  packageConf.scripts.preversion = ensureScript(
    packageConf.scripts.preversion,
    LINT_SCRIPT
  );
  packageConf.scripts.preversion = ensureScript(
    packageConf.scripts.preversion,
    METAPAK_SCRIPT
  );

  // Add the MUST HAVE dev dependencies
  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.commitizen = '^2.10.1';
  packageConf.devDependencies['cz-conventional-changelog'] = '^2.1.0';
  packageConf.devDependencies['conventional-changelog-cli'] = '^2.0.5';

  // Avoid GreenKeeper to update automatically added modules
  // except for this module so that we still benefit from
  // greenkeeper but once to avoid PR spam ;)
  if ('metapak-nfroidure' !== packageConf.name) {
    packageConf.greenkeeper = {
      ignore: [
        'commitizen',
        'cz-conventional-changelog',
        'conventional-changelog-cli',
      ],
    };
  }

  // This job is already done by NPM, but once,.
  // This allows to do it on old repositories
  if (packageConf.repository && 'git' === packageConf.repository.type) {
    const [, userName, repositoryName] =
      GITHUB_REPOSITORY_REGEXP.exec(packageConf.repository.url) || [];
    if (userName && repositoryName) {
      packageConf.bugs = packageConf.bugs || {
        url:
          'https://github.com/' + userName + '/' + repositoryName + '/issues',
      };
      packageConf.homepage =
        packageConf.homepage ||
        'https://github.com/' + userName + '/' + repositoryName + '#readme';
    }
  }

  return packageConf;
};