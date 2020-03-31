'use strict';

const { getMetapakInfos } = require('../lib.js');

module.exports = (file, packageConf) => {
  // Set files to code climate
  if ('.codeclimate.yml' === file.name) {
    const { data } = getMetapakInfos(packageConf);
    if (data.files) {
      file.data = file.data.replace(/\*\*\.js/gm, data.files);
    }
    if (data.testsFiles) {
      file.data += `## Exclude test files.
exclude_patterns:
- "dist/"
- "**/node_modules/"${data.testsFiles.split(' ').map(
        (files) => `
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
