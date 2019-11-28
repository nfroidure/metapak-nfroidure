'use strict';

const { getMetapakInfos } = require('../lib.js');

module.exports = (file, packageConf) => {
  const { data } = getMetapakInfos(packageConf);

  if ('.travis.yml' === file.name && !data.childPackage) {
    file.data = `${file.data}
before_install:
  - export CHROME_BIN=chromium-browser
services:
  - xvfb
`;
  }

  return file;
};
