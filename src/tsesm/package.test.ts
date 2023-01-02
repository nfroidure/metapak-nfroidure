import { describe, test, expect } from '@jest/globals';
import packageTransformer from './package.js';

describe('private', () => {
  describe('Package transformer', () => {
    test('should work', () => {
      expect(
        packageTransformer({
          metapak: {
            configs: ['tsesm'],
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
              "rimraf",
            ],
          },
          "main": "dist/index.js",
          "metapak": {
            "configs": [
              "tsesm",
            ],
            "data": {},
          },
          "scripts": {
            "build": "rimraf -f 'dist' && tsc --outDir dist",
            "precz": "npm run build",
            "preversion": "npm run build",
          },
          "type": "module",
          "types": "dist/index.d.ts",
        }
      `);
    });
  });
});
