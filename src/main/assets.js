'use strict';

const { getMetapakInfos } = require('../lib.js');
const config = require('../config.js');

module.exports = (file, packageConf) => {
  const { data } = getMetapakInfos(packageConf);

  // Rename dot files the right way
  if (file.name.startsWith('_dot_')) {
    file.name = file.name.replace('_dot_', '.');
  }

  // Add author to the license
  if ('LICENSE' === file.name) {
    file.data = file.data.replace(
      /<copyright holders>/gm,
      packageConf.author.name
    );
  }

  // Add NodeJS LTS where needed
  if (['.github/ISSUE_TEMPLATE'].includes(file.name)) {
    file.data = file.data.replace(/<lastNodeLTS>/gm, config.lastNodeLTS);
  }

  // Add .gitignore additionnal files
  if (file.name.endsWith('.gitignore') && data.ignore && data.ignore.length) {
    file.data =
      file.data +
      '\n' +
      '# Project custom ignored file\n' +
      data.ignore.join('\n') +
      '\n';
  }

  // Avoid adding wrong files in child packages
  if (
    data.childPackage &&
    [
      '.github/CODE_OF_CONDUCT.md',
      '.github/CONTRIBUTING',
      '.github/ISSUE_TEMPLATE',
      '.github/PULL_REQUEST_TEMPLATE',
      '.editorconfig',
      '.gitattributes',
      '.gitignore',
    ].includes(file.name)
  ) {
    file.data = '';
  }

  return file;
};
