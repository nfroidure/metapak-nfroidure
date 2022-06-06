'use strict';

const assert = require('assert');
const hooksTransformer = require('./hooks');

describe('Hooks transformer', () => {
  it('should remove old pre-commit hooks', () => {
    assert.deepEqual(
      hooksTransformer(
        {
          'pre-commit': ['npm run architecture && git add ARCHITECTURE.md'],
        },
        {},
      ),
      {
        'pre-commit': [],
      },
    );
  });

  it('should leave existing pre-commit hooks', () => {
    assert.deepEqual(
      hooksTransformer(
        {
          'pre-commit': ['npm t'],
        },
        {},
      ),
      {
        'pre-commit': ['npm t'],
      },
    );
  });
});
