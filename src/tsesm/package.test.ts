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
            "@swc/cli": "^0.1.62",
            "@swc/core": "^1.3.60",
            "@swc/helpers": "^0.5.1",
            "rimraf": "^5.0.1",
            "typescript": "^5.0.4",
          },
          "greenkeeper": {
            "ignore": [
              "typescript",
              "rimraf",
              "@swc/cli",
              "@swc/core",
              "@swc/helpers",
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
            "build": "rimraf 'dist' && swc ./src -s -d dist",
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