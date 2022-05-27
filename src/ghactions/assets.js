'use strict';

const config = require('../config.js');

module.exports = (file) => {
  if ('test.yml' === file.name) {
    const lastNodeLTSMajorPart = parseInt(config.lastNodeLTS.split('.')[0], 10);
    const lastNodeMajorPart = parseInt(config.lastNode.split('.')[0], 10);
    const versions = [];

    for (let i = 0; i <= lastNodeMajorPart - lastNodeLTSMajorPart; i++) {
      if (0 === i) {
        versions.push(lastNodeLTSMajorPart);
        continue;
      }

      const isANodeStableVersion = i % 2 === 0;

      if (isANodeStableVersion) {
        versions.push(lastNodeLTSMajorPart + i);
      }
    }
    file.data = file.data.replace(
      'node-version: []',
      `node-version: [${versions.map((version) => version + '.x').join(', ')}]`
    );
  }

  return file;
};
