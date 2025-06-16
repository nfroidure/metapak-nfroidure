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
           "@swc/core": "^1.12.1",
           "@swc/helpers": "^0.5.17",
           "rimraf": "^6.0.1",
           "typescript": "^5.8.3",
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
           "precz": "node --run types",
           "preversion": "node --run types",
           "types": "rimraf --glob 'dist/**/*.d.ts' && tsc --project . --declaration --emitDeclarationOnly --outDir dist",
         },
         "types": "index.d.ts",
       }
      `);
    });
  });
});
