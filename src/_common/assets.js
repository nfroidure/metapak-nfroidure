'use strict';

module.exports = (file, packageConf) => {
  // Rename dot files the right way
  if(file.name.startsWith('_dot_')) {
    file.name = file.name.replace('_dot_', '.');
  }

  // Add author to the license
  if('LICENSE' === file.name) {
    file.data = file.data.replace(/<copyright holders>/mg, 'Nicolas Froidure');
  }

  // Set files to code climate
  if('.codeclimate.yml' === file.name) {
    if(
      packageConf.metapak &&
      packageConf.metapak.data &&
      packageConf.metapak.data.files
    ) {
      file.data = file.data.replace(/\*\*\.js/mg, packageConf.metapak.data.files);
    }
  }

  return file;
};
