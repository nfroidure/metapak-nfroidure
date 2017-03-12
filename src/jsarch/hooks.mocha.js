'use strict';

const assert = require('assert');
const hooksTransformer = require('./hooks');

describe('Hooks transformer', () => {
  it('should add pre-commit hooks', () => {
    assert.deepEqual(
      hooksTransformer({}),
      {
        'pre-commit': [
          'npm run architecture && git add ARCHITECTURE.md',
        ],
      }
    );
  });

  it('should leave existing pre-commit hooks', () => {
    assert.deepEqual(
      hooksTransformer({
        'pre-commit': [
          'npm t',
        ],
      }),
      {
        'pre-commit': [
          'npm t',
          'npm run architecture && git add ARCHITECTURE.md',
        ],
      }
    );
  });
});
