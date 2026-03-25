import type { GitHooksTransformer } from 'metapak';

const COMMIT_MSG_LINT = `
if [ "$NODE_ENV" != "cli" ] ; then
  if grep -q '^[0-9]\\+.[0-9]\\+.[0-9]\\+$' "$1" ; then
    exit 0;
  else
    node --run commitlint -- --edit "$1" || FAILURE=1;
    if [ "$FAILURE" = 1 ]; then
      exit 1;
    fi
  fi
fi`;
const PRE_COMMIT_SCRIPT = `
node --run precommit || FAILURE=1;
if [ "$FAILURE" = 1 ]; then
  exit 1;
fi`;
const PRE_COMMIT_CWD_WARNING = `
if ! git diff-files --quiet --ignore-submodules ; then
  echo "⚠️ - Unstaged files found:"
  echo $(git diff-files --shortstat)
fi`;

const transformer: GitHooksTransformer<
  {
    childPackage?: boolean;
  },
  unknown
> = (hooks, packageConf) => {
  const {
    metapak: { data },
  } = packageConf;

  if (!data.childPackage) {
    hooks['pre-commit'] = hooks['pre-commit'] || [];
    hooks['pre-commit'].push(PRE_COMMIT_SCRIPT);
    hooks['pre-commit'].push(PRE_COMMIT_CWD_WARNING);
    hooks['commit-msg'] = hooks['commit-msg'] || [];
    hooks['commit-msg'].push(COMMIT_MSG_LINT);
  }
  return hooks;
};

export default transformer;
