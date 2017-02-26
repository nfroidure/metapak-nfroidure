'use strict';

const path = require('path');
const USERNAME = 'nfroidure';

module.exports = (file, packageConf, { PROJECT_DIR, glob, fs, log }) => {
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
    file.data += '[![Build status](https://secure.travis-ci.org/' +
      USERNAME + '/' + packageConf.name +
      '.svg)](https://travis-ci.org/' +
      USERNAME + '/' + packageConf.name +
      ')\n';
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
    file.data += '[![Code Climate](https://codeclimate.com/github/' +
      USERNAME + '/' + packageConf.name +
      '.svg)](https://codeclimate.com/github/' +
      USERNAME + '/' + packageConf.name +
      ')\n';
    file.data += '[![Dependency Status](https://dependencyci.com/github/' +
      USERNAME + '/' + packageConf.name +
      '/badge)](https://dependencyci.com/github/' +
      USERNAME + '/' + packageConf.name +
      ')\n';
    return Promise.all([
      file.data,
      _getReadmeContents({ PROJECT_DIR, fs, log }),
    ]).then((chunks) => {
      file.data = chunks.join('\n') + '\n';
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
    log.error('Cannot read the README.md file contents:', filePath);
    log.error(err.stack);
    throw err;
  });
}
