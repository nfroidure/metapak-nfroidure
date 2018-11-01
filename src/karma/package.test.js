'use strict';

const packageTransformer = require('./package');

describe('Karma', () => {
  describe('Package transformer', () => {
    it('should work with some files', () => {
      expect(
        packageTransformer({
          scripts: {
            test: '',
          },
          metapak: {
            data: {
              testsFiles: 'src/*.js src/**/*.js',
            },
            configs: ['karma'],
          },
        })
      ).toMatchSnapshot();
    });

    it('should work with mocha configs', () => {
      expect(
        packageTransformer({
          scripts: {
            test: '',
          },
          metapak: {
            data: {
              testsFiles: 'src/*.js src/**/*.js',
            },
            configs: ['mocha', 'karma'],
          },
        })
      ).toMatchSnapshot();
    });
  });
});
