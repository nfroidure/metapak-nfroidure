'use strict';

module.exports = file => {
  // Add www to ignored files
  if ('.gitignore' === file.name) {
    file.data += 'www\n';
  }

  return file;
};
