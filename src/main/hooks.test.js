'use strict';

const hooksTransformer = require('./hooks');

describe('main', () => {
  describe('Hooks transformer', () => {
    it('should add pre-commit hooks', () => {
      expect(hooksTransformer({})).toMatchSnapshot();
    });
  });
});
