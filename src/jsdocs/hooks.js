'use strict';

module.exports = (hooks) => {
  hooks['pre-commit'] = hooks['pre-commit'] || [];
  hooks['pre-commit'].push('npm run doc && git add .readme/API.md');
  return hooks;
};
