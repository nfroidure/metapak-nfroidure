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
    "@eslint/js": "^9.7.0",
    "eslint": "^9.7.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-jest": "^28.6.0",
    "eslint-plugin-prettier": "^5.1.3",
    "prettier": "^3.3.3",
  },
  "greenkeeper": {
    "ignore": [
      "eslint",
      "prettier",
      "eslint-config-prettier",
      "eslint-plugin-prettier",
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
  "overrides": {
    "eslint": "^9.7.0",
  },
  "prettier": {
    "printWidth": 80,
    "proseWrap": "always",
    "semi": true,
    "singleQuote": true,
    "trailingComma": "all",
  },
  "scripts": {
    "format": "npm run prettier",
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
    "@eslint/js": "^9.7.0",
    "eslint": "^9.7.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-jest": "^28.6.0",
    "eslint-plugin-prettier": "^5.1.3",
    "prettier": "^3.3.3",
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
  "overrides": {
    "eslint": "^9.7.0",
  },
  "prettier": {
    "printWidth": 80,
    "proseWrap": "always",
    "semi": true,
    "singleQuote": true,
    "trailingComma": "all",
  },
  "scripts": {
    "format": "npm run prettier",
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
    "@eslint/js": "^9.7.0",
    "eslint": "^9.7.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-jest": "^28.6.0",
    "eslint-plugin-prettier": "^5.1.3",
    "prettier": "^3.3.3",
    "typescript-eslint": "^7.16.0",
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
  "overrides": {
    "eslint": "^9.7.0",
  },
  "prettier": {
    "printWidth": 80,
    "proseWrap": "always",
    "semi": true,
    "singleQuote": true,
    "trailingComma": "all",
  },
  "scripts": {
    "format": "npm run prettier",
    "lint": "eslint src/*.js src/**/*.js",
    "prettier": "prettier --write src/*.js src/**/*.js",
  },
}
`);
    });
  });
});
