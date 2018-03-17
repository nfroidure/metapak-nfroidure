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
  });
});
