'use strict';

const assert = require('assert');
const hooksTransformer = require('./hooks');

const COMMIT_MSG_COMMITIZEN_CHECK = `
if [ "$NODE_ENV" != "cli" ] ; then
  if grep -q '^[0-9]\\+.[0-9]\\+.[0-9]\\+$' "$1" ; then
    exit 0;
  else
    echo "Please commit with \\\`npm run cz -- (usual commit args)\\\`"
    echo "To bypass commitizen add \\\`NODE_ENV=cli\\\` to your command"
    echo "You may want to set an alias: \\\`alias gicz='npm run cz -- '\\\`"
    exit 1;
  fi
fi`;
const PRE_COMMIT_QUALITY_CHECK = `
npm run test && npm run lint || exit 1`;

describe('Hooks transformer', () => {
  it('should add pre-commit hooks', () => {
    assert.deepEqual(
      hooksTransformer({}),
      {
        'pre-commit': [
          PRE_COMMIT_QUALITY_CHECK,
        ],
        'commit-msg': [
          COMMIT_MSG_COMMITIZEN_CHECK,
        ],
      }
    );
  });
});
