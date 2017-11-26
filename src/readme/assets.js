'use strict';

const path = require('path');
const USERNAME = 'nfroidure';

module.exports = (file, packageConf, { PROJECT_DIR, glob, fs, log }) => {
  const metapakConfigs = packageConf.metapak &&
    packageConf.metapak.configs ?
    packageConf.metapak.configs :
    [{}];

  // Add www to ignored files
  if('README.md' === file.name) {
    // Header
    file.data += '# ' + packageConf.name + '\n';
    if(packageConf.description) {
      file.data += '> ' + packageConf.description + '\n';
    }
    file.data += '\n';

    // Badges
    file.data += '[![NPM version](https://badge.fury.io/js/' +
      packageConf.name + '.svg)](https://npmjs.org/package/' +
      packageConf.name + ')\n';
    if(metapakConfigs.includes('travis')) {
      file.data += '[![Build status](https://secure.travis-ci.org/' +
        USERNAME + '/' + packageConf.name +
        '.svg)](https://travis-ci.org/' +
        USERNAME + '/' + packageConf.name +
        ')\n';
    }
    file.data += '[![Dependency Status](https://david-dm.org/' +
      USERNAME + '/' + packageConf.name +
      '.svg)](https://david-dm.org/' +
      USERNAME + '/' + packageConf.name +
      ')\n';
    file.data += '[![devDependency Status](https://david-dm.org/' +
      USERNAME + '/' + packageConf.name +
      '/dev-status.svg)](https://david-dm.org/' +
      USERNAME + '/' + packageConf.name +
      '#info=devDependencies)\n';
    if(packageConf.devDependencies.coveralls) {
      file.data += '[![Coverage Status](https://coveralls.io/repos/' +
        USERNAME + '/' + packageConf.name +
        '/badge.svg?branch=master)](https://coveralls.io/r/' +
        USERNAME + '/' + packageConf.name +
        '?branch=master)\n';
    }
    if(metapakConfigs.includes('codeclimate')) {
      file.data += '[![Code Climate](https://codeclimate.com/github/' +
        USERNAME + '/' + packageConf.name +
        '.svg)](https://codeclimate.com/github/' +
        USERNAME + '/' + packageConf.name +
        ')\n';
    }
    file.data += '[![Dependency Status](https://dependencyci.com/github/' +
      USERNAME + '/' + packageConf.name +
      '/badge)](https://dependencyci.com/github/' +
      USERNAME + '/' + packageConf.name +
      ')\n';
    return Promise.all([
      file.data,
      _getReadmeContents({ PROJECT_DIR, fs, log }),
      _getAPIContents({ PROJECT_DIR, fs, log }),
    ]).then((chunks) => {
      file.data = chunks.filter(_identity).join('\n') + '\n';
      file.data += '# License\n' +
      '[' + packageConf.license + '](https://github.com/' +
      USERNAME + '/' + packageConf.name + '/blob/master/LICENSE)\n';
      return file;
    });
  }

  return file;
};

function _getReadmeContents({ PROJECT_DIR, fs, log }) {
  const filePath = path.join(PROJECT_DIR, '.readme', 'contents.md');

  return fs.readFileAsync(filePath, 'utf8')
  .catch((err) => {
    log('error', 'Cannot read the README.md file contents:', filePath);
    log('stack', err.stack);
    throw err;
  });
}

function _getAPIContents({ PROJECT_DIR, fs, log }) {
  const filePath = path.join(PROJECT_DIR, '.readme', 'API.md');

  return fs.readFileAsync(filePath, 'utf8')
  .catch((err) => {
    log('debug', 'Cannot read the API.md file contents:', filePath);
    log('debug', err.stack);
    return '';
  });
}

function _identity(me) { return me; }
