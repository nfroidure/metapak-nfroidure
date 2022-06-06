'use strict';

const packageTransformer = require('./package');

describe('mocha', () => {
  describe('Package transformer', () => {
    it('should work with some files', () => {
      expect(
        packageTransformer({
          metapak: {
            data: {
              testsFiles: 'src/*.js src/**/*.js',
            },
          },
          scripts: {
            test: '',
          },
        }),
      ).toMatchSnapshot();
    });

    it('should work with child packages', () => {
      expect(
        packageTransformer({
          metapak: {
            data: {
              childPackage: true,
              files: 'src/*.js src/**/*.js',
            },
          },
        }),
      ).toMatchSnapshot();
    });
  });
});
