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
  if('.travis.yml' === file.name) {
    const lastNodeLTSMajorPart = parseInt(config.lastNodeLTS.split('.')[0], 10);
    const lastNodeMajorPart = parseInt(config.lastNode.split('.')[0], 10);

    for(let i = 0; i <= lastNodeMajorPart - lastNodeLTSMajorPart; i++) {
      if(0 === i) {
        file.data += '  - ' + lastNodeLTSMajorPart + '\n';
        file.data += '  - ' + config.lastNodeLTS + '\n';
        continue;
      }
      file.data += '  - ' + (lastNodeLTSMajorPart + i) + '\n';
    }
  }

  // Set files to code climate
  if('.codeclimate.yml' === file.name) {
    if(
      packageConf.metapak &&
      packageConf.metapak.data &&
      packageConf.metapak.data.files
    ) {
      file.data = file.data.replace(/\*\*\.js/mg, packageConf.metapak.data.files);
    }
  }

  return file;
};
