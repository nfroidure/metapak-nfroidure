'use strict';

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
const PRE_COMMIT_METAPAK_RUN = `
npm run metapak -- -s || exit 1`;

module.exports = hooks => {
  hooks['pre-commit'] = hooks['pre-commit'] || [];
  hooks['pre-commit'].push(PRE_COMMIT_METAPAK_RUN);
  hooks['pre-commit'].push(PRE_COMMIT_QUALITY_CHECK);
  hooks['commit-msg'] = hooks['commit-msg'] || [];
  hooks['commit-msg'].push(COMMIT_MSG_COMMITIZEN_CHECK);
  return hooks;
};
