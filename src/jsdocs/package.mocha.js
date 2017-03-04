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
          'jsdoc-to-markdown': '^3.0.0',
        },
        scripts: {
          doc: 'mkdir -p .readme;' +
            ' echo "# API" > .readme/API.md;' +
            ' jsdoc2md yolo.js >> .readme/API.md',
        },
        greenkeeper: {
          ignore: ['jsdoc-to-markdown'],
        },
      }
    );
  });
});
