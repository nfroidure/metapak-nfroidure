import type { PackageJSONTransformer } from 'metapak';
import type { ESLint } from 'eslint';

const transformer: PackageJSONTransformer<
  { childPackage?: boolean; rootPackage?: boolean; files?: string },
  {
    greenkeeper?: { ignore?: string[] };
    eslintConfig?: ESLint.ConfigData;
  }
> = (packageConf) => {
  const {
    metapak: { data, configs },
  } = packageConf;

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

  packageConf.scripts.format = 'npm run prettier';

  // Add the MUST HAVE dev dependencies
  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.eslint = '^8.57.0';
  packageConf.devDependencies.prettier = '^3.2.5';
  packageConf.devDependencies['eslint-config-prettier'] = '^8.10.0';
  packageConf.devDependencies['eslint-plugin-prettier'] = '^5.1.3';

  packageConf.eslintConfig = {
    extends: ['eslint:recommended', 'plugin:prettier/recommended'],
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
    trailingComma: 'all',
    proseWrap: 'always',
  };

  // Special configuration for TypeScript
  if (configs.includes('typescript') || configs.includes('tsesm')) {
    packageConf.devDependencies['@typescript-eslint/eslint-plugin'] = '^7.10.0';
    packageConf.devDependencies['@typescript-eslint/parser'] = '^7.10.0';
    packageConf.eslintConfig = packageConf.eslintConfig || {};
    packageConf.eslintConfig.parser = '@typescript-eslint/parser';
    packageConf.eslintConfig.extends = [
      ...(packageConf.eslintConfig.extends instanceof Array
        ? packageConf.eslintConfig.extends
        : packageConf.eslintConfig.extends
          ? [packageConf.eslintConfig.extends]
          : []),
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
    ];
    packageConf.eslintConfig.ignorePatterns = ['*.d.ts'];
  }

  if ('metapak-nfroidure' !== packageConf.name && !data.childPackage) {
    packageConf.greenkeeper = {
      ignore: [
        ...new Set(
          (packageConf?.greenkeeper?.ignore || [])
            .concat([
              'eslint',
              'prettier',
              'eslint-config-prettier',
              'eslint-plugin-prettier',
              '@typescript-eslint/eslint-plugin',
              '@typescript-eslint/parser',
            ])
            .filter((dependency) => packageConf?.devDependencies?.[dependency]),
        ),
      ],
    };
  }

  return packageConf;
};

export default transformer;
