import { describe, test, expect } from '@jest/globals';
import packageTransformer from './package.js';

describe('eslint', () => {
  describe('Package transformer', () => {
    test('should work with some files', () => {
      expect(
        packageTransformer({
          metapak: {
            configs: ['eslint'],
            data: {
              files: 'src/*.js src/**/*.js',
            },
          },
        }),
      ).toMatchInlineSnapshot(`
       {
         "devDependencies": {
           "@eslint/js": "^10.0.1",
           "eslint": "^10.2.0",
           "eslint-config-prettier": "^10.1.8",
           "eslint-plugin-jest": "^29.15.1",
           "eslint-plugin-prettier": "^5.5.5",
           "prettier": "^3.8.1",
         },
         "metapak": {
           "configs": [
             "eslint",
           ],
           "data": {
             "files": "src/*.js src/**/*.js",
           },
         },
         "prettier": {
           "printWidth": 80,
           "proseWrap": "always",
           "semi": true,
           "singleQuote": true,
           "trailingComma": "all",
         },
         "scripts": {
           "format": "node --run prettier",
           "lint": "eslint src/*.js src/**/*.js",
           "prettier": "prettier --write src/*.js src/**/*.js",
         },
       }
      `);
    });

    test('should work with child packages', () => {
      expect(
        packageTransformer({
          metapak: {
            configs: ['eslint'],
            data: {
              childPackage: true,
              files: 'src/*.js src/**/*.js',
            },
          },
        }),
      ).toMatchInlineSnapshot(`
       {
         "devDependencies": {
           "@eslint/js": "^10.0.1",
           "eslint": "^10.2.0",
           "eslint-config-prettier": "^10.1.8",
           "eslint-plugin-jest": "^29.15.1",
           "eslint-plugin-prettier": "^5.5.5",
           "prettier": "^3.8.1",
         },
         "metapak": {
           "configs": [
             "eslint",
           ],
           "data": {
             "childPackage": true,
             "files": "src/*.js src/**/*.js",
           },
         },
         "prettier": {
           "printWidth": 80,
           "proseWrap": "always",
           "semi": true,
           "singleQuote": true,
           "trailingComma": "all",
         },
         "scripts": {
           "format": "node --run prettier",
           "lint": "eslint src/*.js src/**/*.js",
           "prettier": "prettier --write src/*.js src/**/*.js",
         },
       }
      `);
    });

    test('should work with typescript configs', () => {
      expect(
        packageTransformer({
          metapak: {
            configs: ['eslint', 'typescript'],
            data: {
              childPackage: true,
              files: 'src/*.js src/**/*.js',
            },
          },
        }),
      ).toMatchInlineSnapshot(`
       {
         "devDependencies": {
           "@eslint/js": "^10.0.1",
           "eslint": "^10.2.0",
           "eslint-config-prettier": "^10.1.8",
           "eslint-plugin-jest": "^29.15.1",
           "eslint-plugin-prettier": "^5.5.5",
           "prettier": "^3.8.1",
         },
         "metapak": {
           "configs": [
             "eslint",
             "typescript",
           ],
           "data": {
             "childPackage": true,
             "files": "src/*.js src/**/*.js",
           },
         },
         "prettier": {
           "printWidth": 80,
           "proseWrap": "always",
           "semi": true,
           "singleQuote": true,
           "trailingComma": "all",
         },
         "scripts": {
           "format": "node --run prettier",
           "lint": "eslint src/*.js src/**/*.js",
           "prettier": "prettier --write src/*.js src/**/*.js",
         },
       }
      `);
    });
  });
});
