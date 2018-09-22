'use strict';

const { getMetapakData } = require('../lib.js');

module.exports = (file, packageConf) => {
  // Set files to code climate
  if ('.codeclimate.yml' === file.name) {
    const metapakData = getMetapakData(packageConf);
    if (metapakData.files) {
      file.data = file.data.replace(
        /\*\*\.js/gm,
        packageConf.metapak.data.files
      );
    }
    if (metapakData.testFiles) {
      file.data += `## Exclude test files.
exclude_patterns:
- "dist/"
- "**/node_modules/"${metapakData.testFiles.split(' ').map(
        files => `
- "${
          files.startsWith("'") && files.endsWith("'")
            ? files.slice(1, -1)
            : files
        }"`
      )}
`;
    }
  }

  return file;
};
