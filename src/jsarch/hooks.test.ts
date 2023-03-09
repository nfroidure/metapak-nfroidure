import { describe, test, expect } from '@jest/globals';
import hooksTransformer from './hooks.js';

describe('Hooks transformer', () => {
  test('should remove old pre-commit hooks', () => {
    expect(
      hooksTransformer(
        {
          'pre-commit': ['npm run architecture && git add ARCHITECTURE.md'],
        },
        {
          metapak: {
            configs: ['jsarch'],
            data: {},
          },
        },
      ),
    ).toEqual({
      'pre-commit': [],
    });
  });

  test('should leave existing pre-commit hooks', () => {
    expect(
      hooksTransformer(
        {
          'pre-commit': ['npm t'],
        },
        {
          metapak: {
            configs: ['jsarch'],
            data: {},
          },
        },
      ),
    ).toEqual({
      'pre-commit': ['npm t'],
    });
  });
});
