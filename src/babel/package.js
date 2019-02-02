'use strict';

const YError = require('yerror');
const config = require('../config.js');
const { getMetapakInfos } = require('../lib.js');
const COMPILE_COMMAND = 'npm run compile';
const DEFAULT_BABEL_CONFIG = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          node: config.lastNodeLTS,
        },
      },
    ],
  ],
  plugins: ['@babel/plugin-proposal-object-rest-spread'],
};

module.exports = packageConf => {
  const { configs, data } = getMetapakInfos(packageConf);

  // Add Babel config
  packageConf.babel = packageConf.babel
    ? packageConf.babel
    : DEFAULT_BABEL_CONFIG;

  // Set the Node support in all cases
  packageConf.babel.presets = packageConf.babel.presets.map(preset => {
    if (preset[0] !== '@babel/env') {
      return preset;
    }
    preset[1].targets.node = config.lastNodeLTS;
    return preset;
  });

  // Fix existing babel config
  packageConf.babel.presets = packageConf.babel.presets.map(preset => {
    if (!(preset instanceof Array)) {
      return preset;
    }
    const [presetName, ...presetArgs] = preset;

    return presetName === 'env'
      ? ['@babel/env', ...presetArgs]
      : [presetName, ...presetArgs];
  });
  packageConf.babel.plugins = packageConf.babel.plugins.map(plugin =>
    plugin === 'transform-object-rest-spread'
      ? '@babel/plugin-proposal-object-rest-spread'
      : plugin
  );

  // Set dist as the bundle files
  packageConf.metapak = Object.assign({}, packageConf.metapak || {}, {
    data: Object.assign({}, data, {
      bundleFiles: [
        ...new Set((data.bundleFiles || []).concat(['dist/**/*.js'])),
      ],
    }),
  });

  // Adding Babel compile script
  packageConf.scripts = packageConf.scripts || {};
  packageConf.scripts.compile = data.rootPackage
    ? 'lerna run compile'
    : configs.includes('typescript')
    ? "babel --extensions '.ts,.js' src --out-dir=dist"
    : 'babel src --out-dir=dist';

  // We have to compile with Babel before pushing a version
  packageConf.scripts.preversion = packageConf.scripts.preversion || '';
  packageConf.scripts.preversion = packageConf.scripts.preversion.includes(
    COMPILE_COMMAND
  )
    ? packageConf.scripts.preversion
    : packageConf.scripts.preversion + ' && ' + COMPILE_COMMAND;

  packageConf.devDependencies = packageConf.devDependencies || {};
  delete packageConf.devDependencies[
    'babel-plugin-transform-async-to-module-method'
  ];
  delete packageConf.devDependencies['babel-cli'];
  delete packageConf.devDependencies['babel-core'];
  delete packageConf.devDependencies['babel-register'];
  delete packageConf.devDependencies['babel-preset-env'];
  delete packageConf.devDependencies[
    'babel-plugin-transform-object-rest-spread'
  ];

  // Istanbul needed a specific version to work with babel
  // but let's remove it snce we do not use it anymore
  delete packageConf.devDependencies.istanbul;

  // Jest needed an additionnal module to work with babel
  // but it is no longer needed
  if (configs.includes('jest')) {
    delete packageConf.devDependencies['babel-core'];
  }

  packageConf.devDependencies['@babel/cli'] = '^7.2.3';
  packageConf.devDependencies['@babel/core'] = '^7.2.2';
  packageConf.devDependencies['@babel/register'] = '^7.0.0';
  packageConf.devDependencies['@babel/preset-env'] = '^7.3.1';
  packageConf.devDependencies['@babel/plugin-proposal-object-rest-spread'] =
    '^7.3.1';

  // Add ESLint tweaks
  if (configs.includes('eslint')) {
    if (configs.indexOf('eslint') > configs.indexOf('babel')) {
      throw new YError('E_BAD_CONFIG_ORDER', 'babel', 'eslint');
    }
    packageConf.devDependencies['babel-eslint'] = '^10.0.1';
    packageConf.eslintConfig = Object.assign(
      {},
      packageConf.eslintConfig || {},
      {
        extends: 'eslint:recommended',
        parserOptions: {
          ecmaVersion: 2018,
          sourceType: 'module',
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
      }
    );
    packageConf.prettier = {
      semi: true,
      printWidth: 80,
      singleQuote: true,
      trailingComma: 'all',
      proseWrap: 'always',
    };
  }

  // Special configuration for TypeScript
  if (configs.includes('typescript')) {
    packageConf.babel.presets = [
      ...new Set(['@babel/typescript', ...packageConf.babel.presets]),
    ];
    packageConf.babel.plugins = [
      ...new Set([
        '@babel/proposal-class-properties',
        ...packageConf.babel.plugins,
      ]),
    ];
    packageConf.devDependencies['@babel/preset-typescript'] = '^7.1.0';
    packageConf.devDependencies['@babel/plugin-proposal-class-properties'] =
      '^7.3.0';
  }

  if ('metapak-nfroidure' !== packageConf.name && !data.childPackage) {
    packageConf.greenkeeper = {
      ignore: [
        ...new Set(
          (packageConf.greenkeeper && packageConf.greenkeeper.ignore
            ? packageConf.greenkeeper.ignore
            : []
          )
            .concat([
              '@babel/cli',
              '@babel/core',
              '@babel/register',
              '@babel/preset-env',
              '@babel/plugin-proposal-object-rest-spread',
            ])
            .concat(
              configs.includes('typescript')
                ? [
                    '@babel/preset-typescript',
                    '@babel/plugin-proposal-class-properties',
                  ]
                : []
            )
            .concat(configs.includes('eslint') ? ['babel-eslint'] : [])
            .concat(configs.includes('jest') ? ['babel-core'] : [])
        ),
      ],
    };
  }

  return packageConf;
};
