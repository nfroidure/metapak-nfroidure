import { describe, test, expect } from '@jest/globals';
import hooksTransformer from './hooks.js';

describe('Hooks transformer', () => {
  test('should add pre-commit hooks', () => {
    expect(
      hooksTransformer(
        {
          'pre-commit': ['npm run doc && git add API.md'],
        },
        {
          metapak: { configs: ['jsdocs'], data: {} },
        },
      ),
    ).toMatchInlineSnapshot(`
      {
        "pre-commit": [],
      }
    `);
  });

  test('should leave existing pre-commit hooks', () => {
    expect(
      hooksTransformer(
        {
          'pre-commit': ['npm t'],
        },
        {
          metapak: { configs: ['jsdocs'], data: {} },
        },
      ),
    ).toMatchInlineSnapshot(`
      {
        "pre-commit": [
          "npm t",
        ],
      }
    `);
  });
});
