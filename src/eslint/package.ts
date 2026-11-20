import { type PackageJSONTransformer } from 'metapak';
import { ensureVersion } from '../lib.js';

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
  packageConf.devDependencies.eslint = ensureVersion(
    '^10.15.0',
    packageConf.devDependencies.eslint,
  );
  packageConf.devDependencies['@eslint/js'] = ensureVersion(
    '^10.0.1',
    packageConf.devDependencies['@eslint/js'],
  );
  packageConf.devDependencies.prettier = ensureVersion(
    '^3.10.1',
    packageConf.devDependencies.prettier,
  );
  packageConf.devDependencies['eslint-config-prettier'] = ensureVersion(
    '^10.1.8',
    packageConf.devDependencies['eslint-config-prettier'],
  );
  packageConf.devDependencies['eslint-plugin-prettier'] = ensureVersion(
    '^5.5.7',
    packageConf.devDependencies['eslint-plugin-prettier'],
  );
  packageConf.devDependencies['eslint-plugin-jest'] = ensureVersion(
    '^29.17.1',
    packageConf.devDependencies['eslint-plugin-jest'],
  );

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
    packageConf.devDependencies['typescript-eslint'] = ensureVersion(
      '^8.73.0',
      packageConf.devDependencies['typescript-eslint'],
    );
    // Overrides not required anymore
    packageConf.overrides = undefined;
  }

  return packageConf;
};

export default transformer;
