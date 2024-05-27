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
    "@swc/core": "^1.5.7",
    "@swc/helpers": "^0.5.11",
    "rimraf": "^5.0.7",
    "typescript": "^5.4.5",
  },
  "greenkeeper": {
    "ignore": [
      "typescript",
      "rimraf",
      "@swc/core",
      "@swc/helpers",
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
    "types": "rimraf --glob 'dist/**/*.d.ts' && tsc --project . --declaration --emitDeclarationOnly --outDir dist",
  },
  "types": "index.d.ts",
}
`);
    });
  });
});
