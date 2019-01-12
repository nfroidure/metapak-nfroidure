'use strict';

const { getMetapakInfos } = require('../lib.js');

module.exports = packageConf => {
  const { data } = getMetapakInfos(packageConf);

  if (!data.files) {
    throw new Error('E_NO_FILES');
  }

  packageConf.scripts = packageConf.scripts || {};
  packageConf.scripts.lint = 'eslint ' + data.files;
  packageConf.scripts.prettier = 'prettier --write ' + data.files;

  // Add the MUST HAVE dev dependencies
  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.eslint = '^5.12.0';
  delete packageConf.devDependencies['eslint-config-simplifield'];
  packageConf.devDependencies.prettier = '^1.15.3';
  packageConf.devDependencies['eslint-plugin-prettier'] = '^3.0.1';

  if ('metapak-nfroidure' !== packageConf.name && !data.childPackage) {
    packageConf.greenkeeper = {
      ignore: [
        ...new Set(
          (packageConf.greenkeeper && packageConf.greenkeeper.ignore
            ? packageConf.greenkeeper.ignore
            : []
          ).concat(['eslint', 'eslint-config-prettier', 'prettier'])
        ),
      ],
    };
  }

  packageConf.eslintConfig = {
    extends: ['eslint:recommended'],
    parserOptions: {
      sourceType: 'script',
      modules: true,
    },
    env: {
      es6: true,
      node: true,
      jest: true,
      mocha: true,
    },
    plugins: ['prettier'],
    rules: {
      'prettier/prettier': 'error',
    },
  };

  packageConf.prettier = {
    semi: true,
    printWidth: 80,
    singleQuote: true,
    trailingComma: 'es5',
    proseWrap: 'always',
  };

  return packageConf;
};
