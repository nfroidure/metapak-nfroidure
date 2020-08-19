'use strict';

const config = require('../config.js');
const { ensureScript, getMetapakInfos } = require('../lib.js');

const GITHUB_REPOSITORY_REGEXP = /git\+https:\/\/github.com\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\.git/;
const TEST_SCRIPT = 'npm t';
const LINT_SCRIPT = 'npm run lint';
const METAPAK_SCRIPT = 'npm run metapak -- -s';
const CHANGELOG_SCRIPT = 'npm run changelog';

module.exports = (packageConf) => {
  const { data } = getMetapakInfos(packageConf);

  // Looks like i am the author of all my modules
  // so adding myself per default ;)
  packageConf.author =
    typeof packageConf.author !== 'object'
      ? {
          name: 'Nicolas Froidure',
          email: 'nicolas.froidure@insertafter.com',
          url: 'https://insertafter.com/en/index.html',
        }
      : packageConf.author;

  // Add an empty contributors field per default
  packageConf.contributors = packageConf.contributors || [];

  // I mostly publish under MIT license, let's default to it
  packageConf.license = packageConf.license || 'MIT';

  // Let's always start with the 0.0.0 version
  packageConf.version = packageConf.version || '0.0.0';

  // Supporting Node LTS version only
  packageConf.engines = { node: '>=' + config.lastNodeLTS };

  // Only add necessar files
  packageConf.files = (data.bundleFiles || ['src']).concat(
    'LICENSE',
    'README.md',
    'CHANGELOG.md'
  );

  // Let's add my handy scripts
  packageConf.scripts = packageConf.scripts || {};

  // I like this, it enable me to run arbitrary npm binary
  // without having global modules
  packageConf.scripts.cli = 'env NODE_ENV=${NODE_ENV:-cli}';

  // Add default scripts to warn they should be there
  if (!packageConf.scripts.test) {
    packageConf.scripts.test = data.rootPackage
      ? 'lerna run test'
      : packageConf.scripts.test || 'echo "WARNING: No tests specified"';
  }
  if (!packageConf.scripts.lint) {
    packageConf.scripts.lint = data.rootPackage
      ? 'lerna run lint'
      : packageConf.scripts.lint || 'echo "WARNING: No linter specified"';
  }

  // Let's use commitizen on main packages
  if (!data.childPackage) {
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
      'conventional-changelog -p angular -i CHANGELOG.md -s && git add CHANGELOG.md';
    packageConf.scripts.version = ensureScript(
      packageConf.scripts.version,
      CHANGELOG_SCRIPT
    );
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
    packageConf.devDependencies.commitizen = '^4.1.2';
    packageConf.devDependencies['cz-conventional-changelog'] = '^3.2.0';
    packageConf.devDependencies['conventional-changelog-cli'] = '^2.1.0';

    // Avoid GreenKeeper to update automatically added modules
    // except for this module so that we still benefit from
    // greenkeeper but once to avoid PR spam ;)
    if ('metapak-nfroidure' !== packageConf.name && !data.childPackage) {
      packageConf.greenkeeper = {
        ignore: [
          'commitizen',
          'cz-conventional-changelog',
          'conventional-changelog-cli',
        ],
      };
    }
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
