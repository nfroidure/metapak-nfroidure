'use strict';

module.exports = (file, packageConf) => {
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
