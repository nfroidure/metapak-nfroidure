'use strict';

module.exports = (file, packageConf) => {
  // Add www to ignored files
  if('.gitignore' === file.name) {
    file.data += 'www\n';
  }

  return file;
};
