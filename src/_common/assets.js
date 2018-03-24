'use strict';

const config = require('../config.js');

module.exports = (file, packageConf) => {
  const metapakData =
    packageConf.metapak && packageConf.metapak.data
      ? packageConf.metapak.data
      : {};

  // Rename dot files the right way
  if (file.name.startsWith('_dot_')) {
    file.name = file.name.replace('_dot_', '.');
  }

  // Add author to the license
  if ('LICENSE' === file.name) {
    file.data = file.data.replace(/<copyright holders>/gm, 'Nicolas Froidure');
  }

  // Add NodeJS LTS where needed
  if (['.github/ISSUE_TEMPLATE'].includes(file.name)) {
    file.data = file.data.replace(/<lastNodeLTS>/gm, config.lastNodeLTS);
  }

  // Add .gitignore additionnal files
  if (
    file.name.endsWith('.gitignore') &&
    metapakData.ignore &&
    metapakData.ignore.length
  ) {
    file.data =
      file.data +
      '\n' +
      '# Project custom ignored file\n' +
      metapakData.ignore.join('\n') +
      '\n';
  }

  return file;
};
