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
           "jest": "^30.0.0",
         },
         "greenkeeper": {
           "ignore": [
             "jest",
           ],
         },
         "jest": {
           "coverageReporters": [
             "lcov",
           ],
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
           "cover": "node --run jest -- --coverage",
           "jest": "NODE_ENV=test jest",
           "test": "node --run jest",
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
           "@swc/jest": "^0.2.38",
           "jest": "^30.0.0",
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
           "cover": "node --run jest -- --coverage",
           "jest": "NODE_OPTIONS=--experimental-vm-modules NODE_ENV=test jest",
           "test": "node --run jest",
         },
       }
      `);
    });
  });
});
