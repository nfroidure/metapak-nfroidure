'use strict';

const config = require('../config.js');

module.exports = (file, packageConf) => {
  // Rename dot files the right way
  if(file.name.startsWith('_dot_')) {
    file.name = file.name.replace('_dot_', '.');
  }

  // Add author to the license
  if('LICENSE' === file.name) {
    file.data = file.data.replace(/<copyright holders>/mg, 'Nicolas Froidure');
  }

  // Add NodeJS LTS where needed
  if([
    '.github/ISSUE_TEMPLATE',
  ].includes(file.name)) {
    file.data = file.data.replace(/<lastNodeLTS>/mg, config.lastNodeLTS);
  }

  return file;
};
