'use strict';

const config = require('../config.js');

module.exports = file => {
  if ('.travis.yml' === file.name) {
    const lastNodeLTSMajorPart = parseInt(config.lastNodeLTS.split('.')[0], 10);
    const lastNodeMajorPart = parseInt(config.lastNode.split('.')[0], 10);

    for (let i = 0; i <= lastNodeMajorPart - lastNodeLTSMajorPart; i++) {
      if (0 === i) {
        file.data += '  - ' + lastNodeLTSMajorPart + '\n';
        file.data += '  - ' + config.lastNodeLTS + '\n';
        continue;
      }
      file.data += '  - ' + (lastNodeLTSMajorPart + i) + '\n';
    }
  }

  return file;
};
