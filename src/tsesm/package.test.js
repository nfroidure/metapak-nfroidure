'use strict';

const packageTransformer = require('./package');

describe('private', () => {
  describe('Package transformer', () => {
    it('should work', () => {
      expect(
        packageTransformer({
          metapak: {
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
