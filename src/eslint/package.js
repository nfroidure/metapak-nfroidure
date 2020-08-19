'use strict';

const { getMetapakInfos } = require('../lib.js');

module.exports = (packageConf) => {
  const { configs, data } = getMetapakInfos(packageConf);

  if (!data.files) {
    throw new Error('E_NO_FILES');
  }

  packageConf.scripts = packageConf.scripts || {};

  if (data.rootPackage) {
    packageConf.scripts.lint = 'npm run lerna -- run eslint ';
    packageConf.scripts.prettier = 'npm run lerna -- run prettier ';
  } else {
    packageConf.scripts.lint = 'eslint ' + data.files;
    packageConf.scripts.prettier = 'prettier --write ' + data.files;
  }

  // Add the MUST HAVE dev dependencies
  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.eslint = '^7.7.0';
  packageConf.devDependencies.prettier = '^2.0.5';
  packageConf.devDependencies['eslint-plugin-prettier'] = '^3.1.4';

  packageConf.eslintConfig = {
    extends: ['eslint:recommended'],
    parserOptions: {
      ecmaVersion: 2018,
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

  // Special configuration for TypeScript
  if (configs.includes('typescript')) {
    packageConf.devDependencies['@typescript-eslint/eslint-plugin'] = '^3.9.1';
    packageConf.devDependencies['@typescript-eslint/parser'] = '^3.9.1';
    packageConf.eslintConfig.parser = '@typescript-eslint/parser';
    packageConf.eslintConfig.ignorePatterns = ['*.d.ts'];
    packageConf.eslintConfig.overrides = [
      // Sadly, ESLint does not take in account that
      // the type are indeed used so disabling this
      // rule for ts files
      {
        files: ['*.ts'],
        rules: {
          'no-unused-vars': [1, { args: 'none' }],
        },
      },
    ];
  }

  if ('metapak-nfroidure' !== packageConf.name && !data.childPackage) {
    packageConf.greenkeeper = {
      ignore: [
        ...new Set(
          (packageConf.greenkeeper && packageConf.greenkeeper.ignore
            ? packageConf.greenkeeper.ignore
            : []
          )
            .concat(['eslint', 'eslint-config-prettier', 'prettier'])
            .concat(
              configs.includes('typescript')
                ? ['@typescript-eslint/parser']
                : []
            )
        ),
      ],
    };
  }

  return packageConf;
};
