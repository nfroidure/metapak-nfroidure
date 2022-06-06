'use strict';

const packageTransformer = require('./package');

describe('mocha', () => {
  describe('Package transformer', () => {
    it('should work with some files', () => {
      expect(
        packageTransformer({
          scripts: {
            test: '',
          },
          metapak: {
            configs: ['mocha'],
            data: {
              testsFiles: 'src/*.js src/**/*.js',
            },
          },
        }),
      ).toMatchSnapshot();
    });

    it('should work with babel config', () => {
      expect(
        packageTransformer({
          scripts: {
            test: '',
          },
          metapak: {
            configs: ['babel', 'mocha'],
            data: {
              testsFiles: 'src/*.js src/**/*.js',
            },
          },
        }),
      ).toMatchSnapshot();
    });
  });
});
