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
            configs: [],
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
            configs: ['mocha'],
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
            configs: ['jest'],
          },
        })
      ).toMatchSnapshot();
    });
  });
});
