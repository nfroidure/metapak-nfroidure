'use strict';

const assert = require('assert');
const packageTransformer = require('./package');

describe('Package transformer for jsdocs', () => {
  it('should work with an empty package.json', () => {
    assert.deepEqual(
      packageTransformer({
        metapak: {
          data: {
            files: 'yolo.js',
          },
        },
        greenkeeper: {
          ignore: [],
        },
      }),
      {
        metapak: {
          data: {
            files: 'yolo.js',
          },
        },
        devDependencies: {
          mermaid: '^7.0.0',
          phantomjs: '^2.1.7',
          jsarch: '1.1.1',
        },
        scripts: {
          architecture: 'jsarch yolo.js > ARCHITECTURE.md',
        },
        greenkeeper: {
          ignore: ['mermaid', 'phantomjs', 'jsarch'],
        },
      }
    );
  });
});
