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
    "@swc/cli": "^0.4.0",
    "@swc/core": "^1.6.13",
    "@swc/helpers": "^0.5.12",
    "rimraf": "^6.0.1",
    "typescript": "^5.5.3",
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
    "build": "rimraf 'dist' && tsc --outDir dist",
    "precz": "npm run build",
    "preversion": "npm run build",
    "rebuild": "swc ./src -s -d dist -C jsc.target=es2022",
    "type-check": "tsc --pretty --noEmit",
  },
  "type": "module",
  "types": "dist/index.d.ts",
}
`);
    });
  });
});
