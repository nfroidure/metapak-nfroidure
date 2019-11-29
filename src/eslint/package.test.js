'use strict';

const packageTransformer = require('./package');

describe('eslint', () => {
  describe('Package transformer', () => {
    it('should work with some files', () => {
      expect(
        packageTransformer({
          metapak: {
            data: {
              files: 'src/*.js src/**/*.js',
            },
          },
        })
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
        })
      ).toMatchSnapshot();
    });

    it('should work with typescript configs', () => {
      expect(
        packageTransformer({
          metapak: {
            data: {
              childPackage: true,
              files: 'src/*.js src/**/*.js',
            },
            configs: ['typescript'],
          },
        })
      ).toMatchSnapshot();
    });
  });
});
