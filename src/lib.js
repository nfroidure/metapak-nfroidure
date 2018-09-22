'use strict';

const escapeStringRegexp = require('escape-string-regexp');

module.exports = {
  ensureScript,
  getMetapakData,
};

function ensureScript(baseScript = '', addedScript) {
  return new RegExp(`(^| && )${escapeStringRegexp(addedScript)}($| && )`).test(
    baseScript
  )
    ? baseScript
    : `${baseScript ? `${baseScript} && ` : baseScript}${addedScript}`;
}

function getMetapakData(packageConf) {
  return packageConf.metapak && packageConf.metapak.data
    ? packageConf.metapak.data
    : {};
}
