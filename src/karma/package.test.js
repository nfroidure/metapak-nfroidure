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
            configs: [],
          },
        })
      ).toMatchSnapshot();
    });
  });
});