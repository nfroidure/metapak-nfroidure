'use strict';

const packageTransformer = require('./package');

describe('Babel', () => {
  describe('Package transformer', () => {
    it('should work with some files', () => {
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
        })
      ).toMatchSnapshot();
    });

    it('should work with mocha config', () => {
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
        })
      ).toMatchSnapshot();
    });

    it('should work with jest config', () => {
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
        })
      ).toMatchSnapshot();
    });

    it('should work with eslint config', () => {
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
        })
      ).toMatchSnapshot();
    });

    it('should work with child packages', () => {
      expect(
        packageTransformer({
          main: 'index.js',
          metapak: {
            data: {
              childPackage: true,
              files: 'src/*.js src/**/*.js',
            },
          },
        })
      ).toMatchSnapshot();
    });
  });
});
