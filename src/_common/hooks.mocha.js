'use strict';

const assert = require('assert');
const hooksTransformer = require('./hooks');

describe('Hooks transformer', () => {
  it('should add pre-commit hooks', () => {
    assert.deepEqual(
      hooksTransformer({}),
      {
        'pre-commit': [
          '\nif [ "$NODE_ENV" != "cli" ] ; then\n' +
          '  echo "Please commit with npm run cz -- (usual commit args)"\n' +
          '  echo "To bypass commitizen add NODE_ENV=cli to your command"\n' +
          '  echo "You may want to set an alias:"\n' +
          '  echo "alias gicz=\'npm run cz -- \'"\n  exit 1;' +
          '\nfi',
          '\nnpm run test && npm run lint || exit 1',
        ],
      }
    );
  });
});
