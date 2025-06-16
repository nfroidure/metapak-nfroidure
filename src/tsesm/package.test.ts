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
           "@swc/cli": "^0.7.7",
           "@swc/core": "^1.12.1",
           "@swc/helpers": "^0.5.17",
           "rimraf": "^6.0.1",
           "typescript": "^5.8.3",
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
           "precz": "node --run build",
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
