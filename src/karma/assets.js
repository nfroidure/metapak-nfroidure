'use strict';

const { getMetapakInfos } = require('../lib.js');

module.exports = (file, packageConf) => {
  const { data } = getMetapakInfos(packageConf);

  if ('.travis.yml' === file.name && !data.childPackage) {
    file.data = `before_script:
  - "export DISPLAY=:99.0"
  - "sh -e /etc/init.d/xvfb start"
  - sleep 3 # give xvfb some time to start
${file.data}`;
  }

  return file;
};
