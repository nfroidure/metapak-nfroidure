import { describe, test, expect } from '@jest/globals';
import packageTransformer from './package.js';

describe('Package transformer for jsdocs', () => {
  test('should work with an empty package.json', () => {
    expect(
      packageTransformer({
        metapak: {
          configs: ['jsarch'],
          data: {
            files: 'yolo.js',
          },
        },
        greenkeeper: {
          ignore: [],
        },
      }),
    ).toMatchInlineSnapshot(`
{
  "devDependencies": {
    "jsarch": "^6.1.2",
  },
  "greenkeeper": {
    "ignore": [
      "jsarch",
    ],
  },
  "metapak": {
    "configs": [
      "jsarch",
    ],
    "data": {
      "files": "yolo.js",
    },
  },
  "scripts": {
    "architecture": "jsarch yolo.js > ARCHITECTURE.md && git add ARCHITECTURE.md",
    "precz": "node --run architecture",
    "preversion": "node --run architecture",
  },
}
`);
  });

  test('should work with child package', () => {
    expect(
      packageTransformer({
        metapak: {
          configs: ['jsarch'],
          data: {
            childPackage: true,
            files: 'yolo.js',
          },
        },
        greenkeeper: {
          ignore: [],
        },
      }),
    ).toMatchInlineSnapshot(`
{
  "devDependencies": {
    "jsarch": "^6.1.2",
  },
  "greenkeeper": {
    "ignore": [],
  },
  "metapak": {
    "configs": [
      "jsarch",
    ],
    "data": {
      "childPackage": true,
      "files": "yolo.js",
    },
  },
  "scripts": {
    "architecture": "jsarch yolo.js > ARCHITECTURE.md && git add ARCHITECTURE.md",
  },
}
`);
  });

  test('should work with typescrit configs', () => {
    expect(
      packageTransformer({
        metapak: {
          configs: ['jsarch', 'typescript'],
          data: {
            childPackage: true,
            files: 'yolo.js',
          },
        },
        greenkeeper: {
          ignore: [],
        },
      }),
    ).toMatchInlineSnapshot(`
{
  "devDependencies": {
    "jsarch": "^6.1.2",
  },
  "greenkeeper": {
    "ignore": [],
  },
  "jsarch": {
    "parserOptions": {
      "plugins": [
        "typescript",
      ],
    },
  },
  "metapak": {
    "configs": [
      "jsarch",
      "typescript",
    ],
    "data": {
      "childPackage": true,
      "files": "yolo.js",
    },
  },
  "scripts": {
    "architecture": "jsarch yolo.js > ARCHITECTURE.md && git add ARCHITECTURE.md",
  },
}
`);
  });
});
