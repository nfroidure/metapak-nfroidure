'use strict';

const packageTransformer = require('./package');

describe('private', () => {
  describe('Package transformer', () => {
    it('should work', () => {
      expect(
        packageTransformer({
          types: 'index.d.ts',
          metapak: {
            data: {},
          },
        })
      ).toMatchSnapshot();
    });
  });
});
