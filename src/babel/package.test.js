'use strict';

const packageTransformer = require('./package');

describe('Babel', () => {
  describe('Package transformer', () => {
    it('should work with some files', () => {
      expect(
        packageTransformer({
          scripts: {
            test: '',
            preversion: '',
          },
          metapak: {
            data: {
              testsFiles: 'src/*.js src/**/*.js',
            },
            configs: ['babel'],
          },
        })
      ).toMatchSnapshot();
    });

    it('should work with mocha config', () => {
      expect(
        packageTransformer({
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
          scripts: {
            test: '',
            preversion: '',
          },
          metapak: {
            data: {
              testsFiles: 'src/*.js src/**/*.js',
            },
            configs: ['eslint', 'babel'],
          },
        })
      ).toMatchSnapshot();
    });
  });
});
