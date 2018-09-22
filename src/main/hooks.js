'use strict';

const COMMIT_MSG_COMMITIZEN_CHECK = `
if [ "$NODE_ENV" != "cli" ] ; then
  if grep -q '^[0-9]\\+.[0-9]\\+.[0-9]\\+$' "$1" ; then
    exit 0;
  else
    echo "⚠️ - Please commit with \\\`npm run cz -- (usual commit args)\\\`"
    echo "💊 - To bypass commitizen add \\\`NODE_ENV=cli\\\` to your command"
    echo "💡 - You may want to set an alias: \\\`alias gicz='npm run cz -- '\\\`"
    exit 1;
  fi
fi`;
const PRE_COMMIT_CWD_WARNING = `
if ! git diff-files --quiet --ignore-submodules ; then
  echo "⚠️ - Unstaged files found:"
  echo $(git diff-files --shortstat)
fi`;

module.exports = hooks => {
  hooks['pre-commit'] = hooks['pre-commit'] || [];
  hooks['pre-commit'].push(PRE_COMMIT_CWD_WARNING);
  hooks['commit-msg'] = hooks['commit-msg'] || [];
  hooks['commit-msg'].push(COMMIT_MSG_COMMITIZEN_CHECK);
  return hooks;
};
