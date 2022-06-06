'use strict';

const escapeStringRegexp = require('escape-string-regexp');

module.exports = {
  ensureScript,
  getMetapakInfos,
};

function ensureScript(baseScript = '', addedScript) {
  return new RegExp(`(^| && )${escapeStringRegexp(addedScript)}($| && )`).test(
    baseScript,
  )
    ? baseScript
    : `${baseScript ? `${baseScript} && ` : baseScript}${addedScript}`;
}

function getMetapakInfos(packageConf) {
  return Object.assign({ data: {}, configs: [] }, packageConf.metapak || {});
}
