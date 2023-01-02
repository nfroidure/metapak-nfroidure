import { describe, test, expect } from '@jest/globals';
import packageTransformer from './package.js';

describe('Babel', () => {
  describe('Package transformer', () => {
    test('should work with some files', () => {
      expect(
        packageTransformer({
          main: 'index',
          module: 'index.mjs',
          scripts: {
            test: '',
            preversion: '',
          },
          metapak: {
            data: {
              testsFiles: 'src/*.js src/**/*.js',
              bundleFiles: [
                'src/**/*.js',
                'LICENSE',
                'README.md',
                'CHANGELOG.md',
                'dist/**/*.js',
              ],
            },
            configs: ['babel'],
          },
        }),
      ).toMatchInlineSnapshot(`
        {
          "babel": {
            "env": {
              "cjs": {
                "comments": true,
                "presets": [
                  [
                    "@babel/env",
                    {
                      "modules": "commonjs",
                      "targets": {
                        "node": "10",
                      },
                    },
                  ],
                ],
              },
              "mjs": {
                "comments": false,
                "presets": [
                  [
                    "@babel/env",
                    {
                      "modules": false,
                      "targets": {
                        "node": "12",
                      },
                    },
                  ],
                ],
              },
            },
            "plugins": [
              "@babel/plugin-proposal-object-rest-spread",
            ],
            "presets": [
              [
                "@babel/env",
                {
                  "targets": {
                    "node": "16.15.0",
                  },
                },
              ],
            ],
            "sourceMaps": true,
          },
          "devDependencies": {
            "@babel/cli": "^7.17.10",
            "@babel/core": "^7.18.2",
            "@babel/plugin-proposal-object-rest-spread": "^7.18.0",
            "@babel/preset-env": "^7.18.2",
            "@babel/register": "^7.17.7",
          },
          "greenkeeper": {
            "ignore": [
              "@babel/cli",
              "@babel/core",
              "@babel/register",
              "@babel/preset-env",
              "@babel/plugin-proposal-object-rest-spread",
            ],
          },
          "main": "index",
          "metapak": {
            "configs": [
              "babel",
            ],
            "data": {
              "bundleFiles": [
                "src/**/*.js",
                "LICENSE",
                "README.md",
                "CHANGELOG.md",
                "dist/**/*.js",
                "dist",
                "src",
              ],
              "testsFiles": "src/*.js src/**/*.js",
            },
          },
          "module": "index.mjs",
          "scripts": {
            "compile": "rimraf -f 'dist' && npm run compile:cjs && npm run compile:mjs",
            "compile:cjs": "babel --env-name=cjs --out-dir=dist --source-maps=true src",
            "compile:mjs": "babel --env-name=mjs --out-file-extension=.mjs --out-dir=dist --source-maps=true src",
            "precz": "npm run compile",
            "preversion": "npm run compile",
            "test": "",
          },
        }
      `);
    });

    test('should work with mocha config', () => {
      expect(
        packageTransformer({
          main: 'index',
          module: 'index.mjs',
          scripts: {
            test: '',
            preversion: '',
          },
          devDependencies: {},
          metapak: {
            data: {
              testsFiles: 'src/*.js src/**/*.js',
            },
            configs: ['babel', 'mocha'],
          },
        }),
      ).toMatchInlineSnapshot(`
        {
          "babel": {
            "env": {
              "cjs": {
                "comments": true,
                "presets": [
                  [
                    "@babel/env",
                    {
                      "modules": "commonjs",
                      "targets": {
                        "node": "10",
                      },
                    },
                  ],
                ],
              },
              "mjs": {
                "comments": false,
                "presets": [
                  [
                    "@babel/env",
                    {
                      "modules": false,
                      "targets": {
                        "node": "12",
                      },
                    },
                  ],
                ],
              },
            },
            "plugins": [
              "@babel/plugin-proposal-object-rest-spread",
            ],
            "presets": [
              [
                "@babel/env",
                {
                  "targets": {
                    "node": "16.15.0",
                  },
                },
              ],
            ],
            "sourceMaps": true,
          },
          "devDependencies": {
            "@babel/cli": "^7.17.10",
            "@babel/core": "^7.18.2",
            "@babel/plugin-proposal-object-rest-spread": "^7.18.0",
            "@babel/preset-env": "^7.18.2",
            "@babel/register": "^7.17.7",
          },
          "greenkeeper": {
            "ignore": [
              "@babel/cli",
              "@babel/core",
              "@babel/register",
              "@babel/preset-env",
              "@babel/plugin-proposal-object-rest-spread",
            ],
          },
          "main": "index",
          "metapak": {
            "configs": [
              "babel",
              "mocha",
            ],
            "data": {
              "bundleFiles": [
                "dist",
                "src",
              ],
              "testsFiles": "src/*.js src/**/*.js",
            },
          },
          "module": "index.mjs",
          "scripts": {
            "compile": "rimraf -f 'dist' && npm run compile:cjs && npm run compile:mjs",
            "compile:cjs": "babel --env-name=cjs --out-dir=dist --source-maps=true src",
            "compile:mjs": "babel --env-name=mjs --out-file-extension=.mjs --out-dir=dist --source-maps=true src",
            "precz": "npm run compile",
            "preversion": "npm run compile",
            "test": "",
          },
        }
      `);
    });

    test('should work with jest config', () => {
      expect(
        packageTransformer({
          main: 'index',
          module: 'index.mjs',
          scripts: {
            test: '',
            preversion: '',
          },
          metapak: {
            data: {
              testsFiles: 'src/*.js src/**/*.js',
            },
            configs: ['babel', 'jest'],
          },
        }),
      ).toMatchInlineSnapshot(`
        {
          "babel": {
            "env": {
              "cjs": {
                "comments": true,
                "presets": [
                  [
                    "@babel/env",
                    {
                      "modules": "commonjs",
                      "targets": {
                        "node": "10",
                      },
                    },
                  ],
                ],
              },
              "mjs": {
                "comments": false,
                "presets": [
                  [
                    "@babel/env",
                    {
                      "modules": false,
                      "targets": {
                        "node": "12",
                      },
                    },
                  ],
                ],
              },
            },
            "plugins": [
              "@babel/plugin-proposal-object-rest-spread",
            ],
            "presets": [
              [
                "@babel/env",
                {
                  "targets": {
                    "node": "16.15.0",
                  },
                },
              ],
            ],
            "sourceMaps": true,
          },
          "devDependencies": {
            "@babel/cli": "^7.17.10",
            "@babel/core": "^7.18.2",
            "@babel/plugin-proposal-object-rest-spread": "^7.18.0",
            "@babel/preset-env": "^7.18.2",
            "@babel/register": "^7.17.7",
          },
          "greenkeeper": {
            "ignore": [
              "@babel/cli",
              "@babel/core",
              "@babel/register",
              "@babel/preset-env",
              "@babel/plugin-proposal-object-rest-spread",
              "babel-core",
            ],
          },
          "main": "index",
          "metapak": {
            "configs": [
              "babel",
              "jest",
            ],
            "data": {
              "bundleFiles": [
                "dist",
                "src",
              ],
              "testsFiles": "src/*.js src/**/*.js",
            },
          },
          "module": "index.mjs",
          "scripts": {
            "compile": "rimraf -f 'dist' && npm run compile:cjs && npm run compile:mjs",
            "compile:cjs": "babel --env-name=cjs --out-dir=dist --source-maps=true src",
            "compile:mjs": "babel --env-name=mjs --out-file-extension=.mjs --out-dir=dist --source-maps=true src",
            "precz": "npm run compile",
            "preversion": "npm run compile",
            "test": "",
          },
        }
      `);
    });

    test('should work with eslint config', () => {
      expect(
        packageTransformer({
          main: 'index',
          module: 'index.mjs',
          scripts: {
            test: '',
            preversion: '',
          },
          eslintConfig: {
            parserOptions: {
              sourceType: 'script',
            },
          },
          prettier: {},
          metapak: {
            data: {
              testsFiles: 'src/*.js src/**/*.js',
            },
            configs: ['eslint', 'babel'],
          },
        }),
      ).toMatchInlineSnapshot(`
        {
          "babel": {
            "env": {
              "cjs": {
                "comments": true,
                "presets": [
                  [
                    "@babel/env",
                    {
                      "modules": "commonjs",
                      "targets": {
                        "node": "10",
                      },
                    },
                  ],
                ],
              },
              "mjs": {
                "comments": false,
                "presets": [
                  [
                    "@babel/env",
                    {
                      "modules": false,
                      "targets": {
                        "node": "12",
                      },
                    },
                  ],
                ],
              },
            },
            "plugins": [
              "@babel/plugin-proposal-object-rest-spread",
            ],
            "presets": [
              [
                "@babel/env",
                {
                  "targets": {
                    "node": "16.15.0",
                  },
                },
              ],
            ],
            "sourceMaps": true,
          },
          "devDependencies": {
            "@babel/cli": "^7.17.10",
            "@babel/core": "^7.18.2",
            "@babel/eslint-parser": "^7.18.2",
            "@babel/plugin-proposal-object-rest-spread": "^7.18.0",
            "@babel/preset-env": "^7.18.2",
            "@babel/register": "^7.17.7",
          },
          "eslintConfig": {
            "parserOptions": {
              "sourceType": "module",
            },
          },
          "greenkeeper": {
            "ignore": [
              "@babel/cli",
              "@babel/core",
              "@babel/register",
              "@babel/preset-env",
              "@babel/plugin-proposal-object-rest-spread",
              "babel-eslint",
            ],
          },
          "main": "index",
          "metapak": {
            "configs": [
              "eslint",
              "babel",
            ],
            "data": {
              "bundleFiles": [
                "dist",
                "src",
              ],
              "testsFiles": "src/*.js src/**/*.js",
            },
          },
          "module": "index.mjs",
          "prettier": {
            "trailingComma": "all",
          },
          "scripts": {
            "compile": "rimraf -f 'dist' && npm run compile:cjs && npm run compile:mjs",
            "compile:cjs": "babel --env-name=cjs --out-dir=dist --source-maps=true src",
            "compile:mjs": "babel --env-name=mjs --out-file-extension=.mjs --out-dir=dist --source-maps=true src",
            "precz": "npm run compile",
            "preversion": "npm run compile",
            "test": "",
          },
        }
      `);
    });

    test('should work with child packages', () => {
      expect(
        packageTransformer({
          main: 'index.js',
          metapak: {
            configs: ['babel'],
            data: {
              childPackage: true,
              files: 'src/*.js src/**/*.js',
            },
          },
        }),
      ).toMatchInlineSnapshot(`
        {
          "babel": {
            "env": {
              "cjs": {
                "comments": true,
                "presets": [
                  [
                    "@babel/env",
                    {
                      "modules": "commonjs",
                      "targets": {
                        "node": "10",
                      },
                    },
                  ],
                ],
              },
              "mjs": {
                "comments": false,
                "presets": [
                  [
                    "@babel/env",
                    {
                      "modules": false,
                      "targets": {
                        "node": "12",
                      },
                    },
                  ],
                ],
              },
            },
            "plugins": [
              "@babel/plugin-proposal-object-rest-spread",
            ],
            "presets": [
              [
                "@babel/env",
                {
                  "targets": {
                    "node": "16.15.0",
                  },
                },
              ],
            ],
            "sourceMaps": true,
          },
          "devDependencies": {
            "@babel/cli": "^7.17.10",
            "@babel/core": "^7.18.2",
            "@babel/plugin-proposal-object-rest-spread": "^7.18.0",
            "@babel/preset-env": "^7.18.2",
            "@babel/register": "^7.17.7",
          },
          "main": "index",
          "metapak": {
            "configs": [
              "babel",
            ],
            "data": {
              "bundleFiles": [
                "dist",
                "src",
              ],
              "childPackage": true,
              "files": "src/*.js src/**/*.js",
            },
          },
          "module": "index.mjs",
          "scripts": {
            "compile": "rimraf -f 'dist' && npm run compile:cjs && npm run compile:mjs",
            "compile:cjs": "babel --env-name=cjs --out-dir=dist --source-maps=true src",
            "compile:mjs": "babel --env-name=mjs --out-file-extension=.mjs --out-dir=dist --source-maps=true src",
          },
        }
      `);
    });
  });
});
