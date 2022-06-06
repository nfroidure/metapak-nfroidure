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
        })
      ).toMatchInlineSnapshot(`
        Object {
          "devDependencies": Object {
            "rimraf": "^3.0.2",
            "typescript": "^4.7.3",
          },
          "greenkeeper": Object {
            "ignore": Array [
              "typescript",
              "rimraf",
            ],
          },
          "main": "dist/index.js",
          "metapak": Object {
            "data": Object {},
          },
          "scripts": Object {
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
