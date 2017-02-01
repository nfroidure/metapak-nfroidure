'use strict';

module.exports = (file, packageConf) => {
  if('LICENSE' === file.name) {
    file.data = file.data.replace(/<copyright holders>/mg, 'Nicolas Froidure');
  }

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
