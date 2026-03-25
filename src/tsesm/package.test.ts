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
    "@swc/cli": "^0.8.0",
    "@swc/core": "^1.15.21",
    "rimraf": "^6.1.3",
    "typescript": "^6.0.2",
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
    "precommit": "node --run build",
    "preversion": "node --run build",
    "rebuild": "swc ./src -s -d dist -C jsc.target=es2022",
  },
  "type": "module",
  "types": "dist/index.d.ts",
}
`);
    });
  });
});
