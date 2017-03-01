'use strict';

const PRE_COMMIT_COMMITIZEN_CHECK = `
if [ "$NODE_ENV" != "cli" ] ; then
  echo "Please commit with npm run cz -- (usual commit args)"
  echo "To bypass commitizen add NODE_ENV=cli to your command"
  echo "You may want to set an alias:"
  echo "alias gicz='npm run cz -- '"
  exit 1;
fi`;
const PRE_COMMIT_QUALITY_CHECK = `
npm run test && npm run lint || exit 1`;

module.exports = (hooks) => {
  hooks['pre-commit'] = hooks['pre-commit'] || [];
  hooks['pre-commit'].push(PRE_COMMIT_COMMITIZEN_CHECK);
  hooks['pre-commit'].push(PRE_COMMIT_QUALITY_CHECK);
  return hooks;
};
