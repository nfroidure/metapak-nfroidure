'use strict';

const packageTransformer = require('./package');

describe('mocha', () => {
  describe('Package transformer', () => {
    it('should work with some files', () => {
      expect(
        packageTransformer({
          metapak: {
            data: {
              testFiles: 'src/*.js src/**/*.js',
            },
          },
          scripts: {
            test: '',
          },
        })
      ).toMatchSnapshot();
    });
  });
});
