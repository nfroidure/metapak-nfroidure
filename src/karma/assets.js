'use strict';

module.exports = (file, packageConf) => {
  if('.travis.yml' === file.name) {
    file.data = `before_script:
  - "export DISPLAY=:99.0"
  - "sh -e /etc/init.d/xvfb start"
  - sleep 3 # give xvfb some time to start
${ file.data }`;
  }

  return file;
};
