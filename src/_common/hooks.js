'use strict';

module.exports = (hooks) => {
  hooks['pre-commit'] = hooks['pre-commit'] || [];
  hooks['pre-commit'].push('npm run test && npm run lint || exit 1');
  return hooks;
};
