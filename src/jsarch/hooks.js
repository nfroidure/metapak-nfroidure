'use strict';

module.exports = hooks => {
  hooks['pre-commit'] = hooks['pre-commit'] || [];
  hooks['pre-commit'].push('npm run architecture && git add ARCHITECTURE.md');
  return hooks;
};
