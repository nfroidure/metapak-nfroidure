import { describe, test, expect } from '@jest/globals';
import packageTransformer from './package.js';

describe('mocha', () => {
  describe('Package transformer', () => {
    test('should work with some files', () => {
      expect(
        packageTransformer({
          scripts: {
            test: '',
          },
          metapak: {
            configs: ['mocha'],
            data: {
              testsFiles: 'src/*.js src/**/*.js',
            },
          },
        }),
      ).toMatchInlineSnapshot(`
        {
          "devDependencies": {
            "coveralls": "^3.1.1",
            "mocha": "^10.2.0",
            "nyc": "^15.1.0",
          },
          "greenkeeper": {
            "ignore": [
              "mocha",
              "nyc",
              "coveralls",
            ],
          },
          "metapak": {
            "configs": [
              "mocha",
            ],
            "data": {
              "testsFiles": "src/*.js src/**/*.js",
            },
          },
          "nyc": {
            "exclude": [
              "src/*.js src/**/*.js",
            ],
          },
          "scripts": {
            "cover": "nyc npm test && nyc report --reporter=html --reporter=text",
            "coveralls": "nyc npm test && nyc report --reporter=text-lcov | coveralls && rm -rf ./coverage",
            "mocha": "mocha src/*.js src/**/*.js",
            "test": "npm run mocha",
          },
        }
      `);
    });

    test('should work with babel config', () => {
      expect(
        packageTransformer({
          scripts: {
            test: '',
          },
          metapak: {
            configs: ['babel', 'mocha'],
            data: {
              testsFiles: 'src/*.js src/**/*.js',
            },
          },
        }),
      ).toMatchInlineSnapshot(`
        {
          "devDependencies": {
            "coveralls": "^3.1.1",
            "mocha": "^10.2.0",
            "nyc": "^15.1.0",
          },
          "greenkeeper": {
            "ignore": [
              "mocha",
              "nyc",
              "coveralls",
            ],
          },
          "metapak": {
            "configs": [
              "babel",
              "mocha",
            ],
            "data": {
              "testsFiles": "src/*.js src/**/*.js",
            },
          },
          "nyc": {
            "exclude": [
              "src/*.js src/**/*.js",
            ],
          },
          "scripts": {
            "cover": "nyc npm test && nyc report --reporter=html --reporter=text",
            "coveralls": "nyc npm test && nyc report --reporter=text-lcov | coveralls && rm -rf ./coverage",
            "mocha": "mocha --require '@babel/register' src/*.js src/**/*.js",
            "test": "npm run mocha",
          },
        }
      `);
    });
  });
});
