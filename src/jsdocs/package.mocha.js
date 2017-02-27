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
      }),
      {
        metapak: {
          data: {
            files: 'yolo.js',
          },
        },
        devDependencies: {
          'jsdoc-to-markdown': '^2.0.1',
        },
        scripts: {
          doc: 'mkdir -p .readme;' +
            ' echo "# API" > .readme/API.md;' +
            ' jsdoc2md yolo.js >> .readme/API.md',
        },
      }
    );
  });
});
