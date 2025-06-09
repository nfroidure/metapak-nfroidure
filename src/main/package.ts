import { ensureScript } from '../lib.js';
import config from '../config.js';
import type { PackageJSONTransformer } from 'metapak';

const GITHUB_REPOSITORY_REGEXP =
  /git\+https:\/\/github.com\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\.git/;
const TEST_SCRIPT = 'node --run test';
const LINT_SCRIPT = 'node --run lint';
const METAPAK_SCRIPT = 'node --run metapak -- -s';
const METAPAK_LERNA_SCRIPT = `node --run lerna -- run --parallel metapak -- -- -s`;
const CHANGELOG_SCRIPT = 'node --run changelog';

const transformer: PackageJSONTransformer<
  {
    childPackage?: boolean;
    rootPackage?: boolean;
    bundleFiles?: string[];
  },
  unknown
> = (packageConf) => {
  const {
    metapak: { data },
  } = packageConf;

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
  if (!data.rootPackage) {
    packageConf.version = packageConf.version || '0.0.0';
  }

  // Supporting Node LTS version only
  packageConf.engines = { node: '>=' + config.lastNodeLTS };

  // Only add necessar files
  packageConf.files = (data.bundleFiles || ['src']).concat(
    'LICENSE',
    'README.md',
    'CHANGELOG.md',
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
  if (!packageConf.scripts.format) {
    packageConf.scripts.format = data.rootPackage
      ? 'lerna run format'
      : packageConf.scripts.format || 'echo "WARNING: No formatter specified"';
  }

  // Let's use commitizen on main packages
  if (!data.childPackage) {
    packageConf.scripts.cz = 'env NODE_ENV=${NODE_ENV:-cli} git cz';
    packageConf.scripts.precz = ensureScript(
      packageConf.scripts.precz,
      TEST_SCRIPT,
      'npm t',
    );
    packageConf.scripts.precz = ensureScript(
      packageConf.scripts.precz,
      LINT_SCRIPT,
      'npm run lint',
    );
    packageConf.scripts.precz = ensureScript(
      packageConf.scripts.precz,
      data.rootPackage
        ? `${METAPAK_LERNA_SCRIPT} && ${METAPAK_SCRIPT}`
        : METAPAK_SCRIPT,
      data.rootPackage
        ? 'npm run metapak -- -s && npm run lerna -- run --parallel metapak'
        : 'npm run metapak -- -s',
    );

    packageConf.config = {
      commitizen: {
        path: './node_modules/cz-conventional-changelog',
      },
    };

    // Add the changelog stuffs
    packageConf.scripts.changelog = data.rootPackage
      ? `conventional-changelog -p angular -i CHANGELOG.md -s -k packages/${packageConf.name}/package.json && git add CHANGELOG.md`
      : 'conventional-changelog -p angular -i CHANGELOG.md -s && git add CHANGELOG.md';
    packageConf.scripts.version = ensureScript(
      packageConf.scripts.version,
      CHANGELOG_SCRIPT,
      'node --run changelog',
    );
    packageConf.scripts.version = ensureScript(
      packageConf.scripts.version,
      CHANGELOG_SCRIPT,
      'node --run changelog',
    );
    packageConf.scripts.preversion = ensureScript(
      packageConf.scripts.preversion,
      TEST_SCRIPT,
      'npm t',
    );
    packageConf.scripts.preversion = ensureScript(
      packageConf.scripts.preversion,
      LINT_SCRIPT,
      'npm run lint',
    );
    packageConf.scripts.preversion = ensureScript(
      packageConf.scripts.preversion,
      data.rootPackage
        ? `${METAPAK_LERNA_SCRIPT} && ${METAPAK_SCRIPT}`
        : METAPAK_SCRIPT,
      data.rootPackage
        ? 'npm run metapak -- -s && npm run lerna -- run --parallel metapak'
        : 'npm run metapak -- -s',
    );

    // Add the MUST HAVE dev dependencies
    packageConf.devDependencies = packageConf.devDependencies || {};
    packageConf.devDependencies.commitizen = '^4.3.1';
    packageConf.devDependencies['cz-conventional-changelog'] = '^3.3.0';
    packageConf.devDependencies['conventional-changelog-cli'] = '^5.0.0';

    // Avoid GreenKeeper to update automatically added modules
    // except for this module so that we still benefit from
    // greenkeeper but once to avoid PR spam ;)
    if ('metapak-nfroidure' !== packageConf.name && !data.childPackage) {
      packageConf.greenkeeper = {
        ignore: [
          'commitizen',
          'cz-conventional-changelog',
          'conventional-changelog-cli',
        ].filter((dependency) => packageConf?.devDependencies?.[dependency]),
      };
    }
  }

  // This job is already done by NPM, but once,.
  // This allows to do it on old repositories
  if (
    packageConf.repository &&
    typeof packageConf.repository === 'object' &&
    'type' in packageConf.repository &&
    'git' === packageConf.repository.type
  ) {
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

export default transformer;
