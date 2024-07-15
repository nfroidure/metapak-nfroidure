import { describe, test, expect } from '@jest/globals';
import packageTransformer from './package.js';

describe('Karma', () => {
  describe('Package transformer', () => {
    test('should work with some files', () => {
      expect(
        packageTransformer({
          scripts: {
            test: '',
          },
          metapak: {
            data: {
              testsFiles: 'src/*.js src/**/*.js',
            },
            configs: ['karma'],
          },
        }),
      ).toMatchInlineSnapshot(`
{
  "devDependencies": {
    "karma": "^6.4.3",
    "karma-chrome-launcher": "^3.2.0",
    "karma-firefox-launcher": "^2.1.3",
  },
  "greenkeeper": {
    "ignore": [
      "karma",
      "karma-chrome-launcher",
      "karma-firefox-launcher",
    ],
  },
  "metapak": {
    "configs": [
      "karma",
    ],
    "data": {
      "testsFiles": "src/*.js src/**/*.js",
    },
  },
  "scripts": {
    "karma": "karma start karma.conf.js",
    "test": "npm run karma",
  },
}
`);
    });

    test('should work with mocha configs', () => {
      expect(
        packageTransformer({
          scripts: {
            test: '',
          },
          metapak: {
            data: {
              testsFiles: 'src/*.js src/**/*.js',
            },
            configs: ['mocha', 'karma'],
          },
        }),
      ).toMatchInlineSnapshot(`
{
  "devDependencies": {
    "karma": "^6.4.3",
    "karma-chrome-launcher": "^3.2.0",
    "karma-firefox-launcher": "^2.1.3",
    "karma-mocha": "^2.0.1",
  },
  "greenkeeper": {
    "ignore": [
      "karma",
      "karma-chrome-launcher",
      "karma-firefox-launcher",
      "karma-mocha",
    ],
  },
  "metapak": {
    "configs": [
      "mocha",
      "karma",
    ],
    "data": {
      "testsFiles": "src/*.js src/**/*.js",
    },
  },
  "scripts": {
    "karma": "karma start karma.conf.js",
    "test": "npm run karma",
  },
}
`);
    });
  });
});
