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
            "eslint": "^8.35.0",
            "eslint-config-prettier": "^8.7.0",
            "eslint-plugin-prettier": "^4.2.1",
            "prettier": "^2.8.4",
          },
          "eslintConfig": {
            "env": {
              "es6": true,
              "jest": true,
              "mocha": true,
              "node": true,
            },
            "extends": [
              "eslint:recommended",
              "plugin:prettier/recommended",
            ],
            "parserOptions": {
              "ecmaVersion": 2018,
              "modules": true,
              "sourceType": "script",
            },
            "plugins": [
              "prettier",
            ],
            "rules": {
              "prettier/prettier": "error",
            },
          },
          "greenkeeper": {
            "ignore": [
              "eslint",
              "eslint-config-prettier",
              "eslint-plugin-prettier",
              "prettier",
            ],
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
            "eslint": "^8.35.0",
            "eslint-config-prettier": "^8.7.0",
            "eslint-plugin-prettier": "^4.2.1",
            "prettier": "^2.8.4",
          },
          "eslintConfig": {
            "env": {
              "es6": true,
              "jest": true,
              "mocha": true,
              "node": true,
            },
            "extends": [
              "eslint:recommended",
              "plugin:prettier/recommended",
            ],
            "parserOptions": {
              "ecmaVersion": 2018,
              "modules": true,
              "sourceType": "script",
            },
            "plugins": [
              "prettier",
            ],
            "rules": {
              "prettier/prettier": "error",
            },
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
            "@typescript-eslint/eslint-plugin": "^5.54.1",
            "@typescript-eslint/parser": "^5.54.1",
            "eslint": "^8.35.0",
            "eslint-config-prettier": "^8.7.0",
            "eslint-plugin-prettier": "^4.2.1",
            "prettier": "^2.8.4",
          },
          "eslintConfig": {
            "env": {
              "es6": true,
              "jest": true,
              "mocha": true,
              "node": true,
            },
            "extends": [
              "eslint:recommended",
              "plugin:prettier/recommended",
              "plugin:@typescript-eslint/eslint-recommended",
              "plugin:@typescript-eslint/recommended",
            ],
            "ignorePatterns": [
              "*.d.ts",
            ],
            "parser": "@typescript-eslint/parser",
            "parserOptions": {
              "ecmaVersion": 2018,
              "modules": true,
              "sourceType": "script",
            },
            "plugins": [
              "prettier",
            ],
            "rules": {
              "prettier/prettier": "error",
            },
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
            "lint": "eslint src/*.js src/**/*.js",
            "prettier": "prettier --write src/*.js src/**/*.js",
          },
        }
      `);
    });
  });
});
