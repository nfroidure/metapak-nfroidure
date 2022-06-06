'use strict';

const path = require('path');
const { apiPath } = require('../config.js');
const { getMetapakInfos } = require('../lib.js');
const USERNAME = 'nfroidure';
const README_CONTENTS_START_TAG = `[//]: # (::contents:start)`;
const README_CONTENTS_END_TAG = `[//]: # (::contents:end)`;
const README_REGEXP =
  /^(?:[^]*)\[\/\/\]: # (?:\(|')::contents:start(?:\)|')\r?\n\r?\n([^]*)\r?\n\r?\n\[\/\/\]: # (?:\(|')::contents:end(?:\)|')(?:[^]*)$/gm;

module.exports = (file, packageConf, { PROJECT_DIR, fs, log }) => {
  const { configs, data } = getMetapakInfos(packageConf);
  const ghPath = getGitHubPathFromModuleName(
    packageConf.name,
    data.childPackage,
  );

  // Simple README templating system
  if ('README.md' === file.name) {
    const ghProjectPath = getGitHubProjectFromRepoURL(
      (packageConf.repository || {}).url || '',
    );
    // Header
    file.data += '# ' + packageConf.name + '\n';
    if (packageConf.description) {
      file.data += '> ' + packageConf.description + '\n';
    }
    file.data += '\n';

    // Badges
    if (!data.noBadge) {
      if (packageConf.license === 'MIT') {
        file.data += `[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/${USERNAME}${ghPath}/LICENSE)\n`;
      }
      if (configs.includes('travis') && ghProjectPath) {
        file.data += `[![Build status](https://travis-ci.com/${ghProjectPath}.svg?branch=master)](https://travis-ci.com/github/${ghProjectPath})\n`;
      }
      if (packageConf.devDependencies.coveralls && ghProjectPath) {
        file.data += `[![Coverage Status](https://coveralls.io/repos/github/${ghProjectPath}/badge.svg?branch=master)](https://coveralls.io/github/${ghProjectPath}?branch=master)\n`;
      }
    }

    return Promise.all([
      _getReadmeContents({ PROJECT_DIR, fs, log }),
      _getAPIContents({ PROJECT_DIR, fs, log }),
    ]).then(([readme, api]) => {
      file.data += '\n\n' + README_CONTENTS_START_TAG + '\n\n';
      if (readme) {
        file.data += readme + '\n';
      }
      file.data += '\n' + README_CONTENTS_END_TAG + '\n\n';
      if (api) {
        file.data += api + '\n';
      }
      file.data += `# Authors\n${[
        packageConf.author,
        ...(packageConf.contributors || []),
      ]
        .map(
          (author) =>
            `- ${
              author.email || author.url
                ? `[${author.name}](${author.url || `mailto:${author.email}`})`
                : author.name
            }`,
        )
        .join('\n')}\n\n`;
      file.data += `# License\n[${packageConf.license}](https://github.com/${USERNAME}${ghPath}/LICENSE)\n`;
      return file;
    });
  }

  return file;
};

function _getReadmeContents({ PROJECT_DIR, fs, log }) {
  const filePath = path.join(PROJECT_DIR, 'README.md');

  return fs
    .readFileAsync(filePath, 'utf8')
    .catch((err) => {
      log('error', 'Cannot read the README.md file contents:', filePath);
      log('stack', err.stack);
      throw err;
    })
    .then((contents) => {
      return contents.replace(README_REGEXP, '$1');
    });
}

function _getAPIContents({ PROJECT_DIR, fs, log }) {
  const filePath = path.join(PROJECT_DIR, apiPath);

  return fs.readFileAsync(filePath, 'utf8').catch((err) => {
    log('debug', 'Cannot read the API.md file contents:', filePath);
    log('debug', err.stack);
    return '';
  });
}

function getGitHubPathFromModuleName(packageName, childPackage = false) {
  if (!packageName.startsWith('@')) {
    return `/${packageName}/blob/master`;
  }
  const [scope, name] = packageName.slice(1).split('/');

  return childPackage
    ? `/${scope}/blob/master/packages/${scope}-${name}`
    : `/${scope}-${name}/blob/master`;
}

function getGitHubProjectFromRepoURL(repoURL) {
  return repoURL.replace(
    /^(?:git\+|)(?:https|ssh):\/\/(?:git@|)github.com\/([^/]+\/[^.]+)\.git$/,
    '$1',
  );
}
