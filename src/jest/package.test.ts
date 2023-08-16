import { describe, test, expect } from '@jest/globals';
import packageTransformer from './package.js';

describe('mocha', () => {
  describe('Package transformer', () => {
    test('should work with some files', () => {
      expect(
        packageTransformer({
          metapak: {
            configs: ['jest'],
            data: {},
          },
          scripts: {
            test: '',
          },
          dependencies: {},
        }),
      ).toMatchInlineSnapshot(`
{
  "dependencies": {},
  "devDependencies": {
    "coveralls": "^3.1.1",
    "jest": "^29.6.2",
  },
  "greenkeeper": {
    "ignore": [
      "jest",
      "coveralls",
    ],
  },
  "jest": {
    "coverageReporters": [
      "lcov",
    ],
    "prettierPath": null,
    "roots": [
      "<rootDir>/src",
    ],
    "testPathIgnorePatterns": [
      "/node_modules/",
    ],
  },
  "metapak": {
    "configs": [
      "jest",
    ],
    "data": {},
  },
  "scripts": {
    "cover": "npm run jest -- --coverage",
    "coveralls": "npm run cover && cat ./coverage/lcov.info | coveralls && rm -rf ./coverage",
    "jest": "NODE_ENV=test jest",
    "test": "npm run jest",
  },
}
`);
    });

    test('should work with child packages', () => {
      expect(
        packageTransformer({
          metapak: {
            configs: ['jest', 'tsesm'],
            data: {
              childPackage: true,
            },
          },
          jest: {
            moduleNameMapper: {
              '#(.*)': '<rootDir>/../../node_modules/$1',
            },
          },
          dependencies: {
            '@types/jest': '^28.1.1',
          },
        }),
      ).toMatchInlineSnapshot(`
{
  "dependencies": {},
  "devDependencies": {
    "@swc/jest": "^0.2.29",
    "jest": "^29.6.2",
  },
  "jest": {
    "coverageReporters": [
      "lcov",
    ],
    "extensionsToTreatAsEsm": [
      ".ts",
    ],
    "globals": undefined,
    "moduleNameMapper": {
      "#(.*)": "<rootDir>/../../node_modules/$1",
      "(.+)\\.js": "$1",
    },
    "preset": undefined,
    "prettierPath": null,
    "roots": [
      "<rootDir>/src",
    ],
    "testEnvironment": "node",
    "testPathIgnorePatterns": [
      "/node_modules/",
    ],
    "transform": {
      "^.+\\.tsx?$": [
        "@swc/jest",
        {},
      ],
    },
  },
  "metapak": {
    "configs": [
      "jest",
      "tsesm",
    ],
    "data": {
      "childPackage": true,
    },
  },
  "scripts": {
    "cover": "npm run jest -- --coverage",
    "jest": "NODE_OPTIONS=--experimental-vm-modules NODE_ENV=test jest",
    "test": "npm run jest",
  },
}
`);
    });
  });
});
