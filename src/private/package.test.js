'use strict';

const packageTransformer = require('./package');

describe('private', () => {
  describe('Package transformer', () => {
    it('should work', () => {
      expect(packageTransformer({})).toMatchSnapshot();
    });
  });
});
