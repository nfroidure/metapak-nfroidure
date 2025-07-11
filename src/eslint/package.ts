import type { PackageJSONTransformer } from 'metapak';

const transformer: PackageJSONTransformer<
  { childPackage?: boolean; rootPackage?: boolean; files?: string },
  {
    greenkeeper?: { ignore?: string[] };
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
    packageConf.scripts.lint = 'node --run lerna -- run eslint ';
    packageConf.scripts.prettier = 'node --run lerna -- run prettier ';
  } else {
    packageConf.scripts.lint = 'eslint ' + data.files;
    packageConf.scripts.prettier = 'prettier --write ' + data.files;
  }

  packageConf.scripts.format = 'node --run prettier';

  // Add the MUST HAVE dev dependencies
  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.eslint = '^9.30.1';
  packageConf.devDependencies['@eslint/js'] = '^9.30.1';
  packageConf.devDependencies.prettier = '^3.6.2';
  packageConf.devDependencies['eslint-config-prettier'] = '^10.1.5';
  packageConf.devDependencies['eslint-plugin-prettier'] = '^5.5.1';
  packageConf.devDependencies['eslint-plugin-jest'] = '^29.0.1';
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
  if (configs.includes('typescript') || configs.includes('tsesm')) {
    packageConf.devDependencies['typescript-eslint'] = '^8.36.0';
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
              'typescript-eslint',
            ])
            .filter((dependency) => packageConf?.devDependencies?.[dependency]),
        ),
      ],
    };
  }

  return packageConf;
};

export default transformer;
