import { describe, test, expect } from '@jest/globals';
import packageTransformer from './package.js';

describe('private', () => {
  describe('Package transformer', () => {
    test('should work', () => {
      expect(
        packageTransformer({
          metapak: {
            configs: ['private'],
            data: {},
          },
        }),
      ).toMatchInlineSnapshot(`
        {
          "metapak": {
            "configs": [
              "private",
            ],
            "data": {},
          },
          "private": true,
        }
      `);
    });
  });
});
