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
          dependencies: {},
        }),
      ).toMatchSnapshot();
    });

    it('should work with child packages', () => {
      expect(
        packageTransformer({
          metapak: {
            configs: ['tsesm'],
            data: {
              childPackage: true,
              files: 'src/*.js src/**/*.js',
            },
          },
          jest: {
            moduleNameMapper: {
              '#(.*)': '<rootDir>/../../node_modules/$1',
            },
          },
          dependencies: {
            '@types/jest': '^28.1.1',
          },
        }),
      ).toMatchSnapshot();
    });
  });
});
