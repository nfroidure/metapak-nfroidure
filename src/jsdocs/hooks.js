'use strict';

const { apiPath } = require('../config.js');

module.exports = (hooks) => {
  hooks['pre-commit'] = hooks['pre-commit'] || [];
  hooks['pre-commit'] = hooks['pre-commit'].filter(
    (hook) => hook !== `npm run doc && git add ${apiPath}`,
  );

  return hooks;
};
