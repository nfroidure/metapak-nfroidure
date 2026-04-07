import { type PackageJSONTransformer } from 'metapak';

const transformer: PackageJSONTransformer<
  { childPackage?: boolean; rootPackage?: boolean; files?: string },
  object
> = (packageConf) => {
  const {
    metapak: { data, configs },
  } = packageConf;

  if (!data.files) {
    throw new Error('E_NO_FILES');
  }

  packageConf.scripts = packageConf.scripts || {};

  if (data.rootPackage) {
    packageConf.scripts.lint = 'node --run lerna -- run eslint ';
    packageConf.scripts.prettier = 'node --run lerna -- run prettier ';
  } else {
    packageConf.scripts.lint = 'eslint ' + data.files;
    packageConf.scripts.prettier = 'prettier --write ' + data.files;
  }

  packageConf.scripts.format = 'node --run prettier';

  // Add the MUST HAVE dev dependencies
  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.eslint = '^10.2.0';
  packageConf.devDependencies['@eslint/js'] = '^10.0.1';
  packageConf.devDependencies.prettier = '^3.8.1';
  packageConf.devDependencies['eslint-config-prettier'] = '^10.1.8';
  packageConf.devDependencies['eslint-plugin-prettier'] = '^5.5.5';
  packageConf.devDependencies['eslint-plugin-jest'] = '^29.15.1';

  // Remove old tweaks
  if ((packageConf.overrides as { eslint: string })?.eslint) {
    delete packageConf.overrides;
  }
  packageConf.prettier = {
    semi: true,
    printWidth: 80,
    singleQuote: true,
    trailingComma: 'all',
    proseWrap: 'always',
  };

  delete packageConf.eslintConfig;
  delete packageConf.devDependencies['@typescript-eslint/eslint-plugin'];
  delete packageConf.devDependencies['@typescript-eslint/parser'];

  // Special configuration for TypeScript
  if (configs.includes('tsesm')) {
    packageConf.devDependencies['typescript-eslint'] = '^8.58.0';
    // TEMPFIX: new ts version not included yet in tooling
    packageConf.overrides = {
      'typescript-eslint': {
        typescript: '^6',
      },
      '@typescript-eslint/eslint-plugin': {
        typescript: '^6',
      },
      '@typescript-eslint/parser': {
        typescript: '^6',
      },
    };
  }

  return packageConf;
};

export default transformer;
