import { describe, test, expect } from '@jest/globals';
import packageTransformer from './package.js';

describe('private', () => {
  describe('Package transformer', () => {
    test('should work', () => {
      expect(
        packageTransformer({
          types: 'index.d.ts',
          metapak: {
            configs: ['private'],
            data: {},
          },
        }),
      ).toMatchInlineSnapshot(`
        {
          "devDependencies": {
            "rimraf": "^3.0.2",
            "typescript": "^4.8.2",
          },
          "greenkeeper": {
            "ignore": [
              "typescript",
            ],
          },
          "metapak": {
            "configs": [
              "private",
            ],
            "data": {},
          },
          "scripts": {
            "precz": "npm run types",
            "preversion": "npm run types",
            "types": "rimraf -f 'dist/**/*.d.ts' && tsc --project . --declaration --emitDeclarationOnly --outDir dist",
          },
          "types": "index.d.ts",
        }
      `);
    });
  });
});
