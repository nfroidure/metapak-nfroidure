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
    "@eslint/js": "^9.30.1",
    "eslint": "^9.30.1",
    "eslint-config-prettier": "^10.1.5",
    "eslint-plugin-jest": "^29.0.1",
    "eslint-plugin-prettier": "^5.5.1",
    "prettier": "^3.6.2",
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
    "@eslint/js": "^9.30.1",
    "eslint": "^9.30.1",
    "eslint-config-prettier": "^10.1.5",
    "eslint-plugin-jest": "^29.0.1",
    "eslint-plugin-prettier": "^5.5.1",
    "prettier": "^3.6.2",
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
    "@eslint/js": "^9.30.1",
    "eslint": "^9.30.1",
    "eslint-config-prettier": "^10.1.5",
    "eslint-plugin-jest": "^29.0.1",
    "eslint-plugin-prettier": "^5.5.1",
    "prettier": "^3.6.2",
    "typescript-eslint": "^8.36.0",
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
