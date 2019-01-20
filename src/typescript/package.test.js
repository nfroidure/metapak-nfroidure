'use strict';

const packageTransformer = require('./package');

describe('private', () => {
  describe('Package transformer', () => {
    it('should work', () => {
      expect(
        packageTransformer({
          metapak: {
            data: {
              typesFiles: 'index.ts',
              typesDefs: 'index.d.ts',
            },
          },
        })
      ).toMatchSnapshot();
    });
  });
});
