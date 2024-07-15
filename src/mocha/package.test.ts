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
    "mocha": "^10.6.0",
    "nyc": "^17.0.0",
  },
  "greenkeeper": {
    "ignore": [
      "mocha",
      "nyc",
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
    "mocha": "^10.6.0",
    "nyc": "^17.0.0",
  },
  "greenkeeper": {
    "ignore": [
      "mocha",
      "nyc",
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
    "mocha": "mocha --require '@babel/register' src/*.js src/**/*.js",
    "test": "npm run mocha",
  },
}
`);
    });
  });
});
