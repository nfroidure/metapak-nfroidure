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
  });
});
