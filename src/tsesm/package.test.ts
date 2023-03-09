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
            "rimraf": "^4.4.0",
            "typescript": "^4.9.5",
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
            "build": "rimraf 'dist' && tsc --outDir dist",
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
