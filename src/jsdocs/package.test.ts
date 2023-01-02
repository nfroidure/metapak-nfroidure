import { describe, test, expect } from '@jest/globals';
import packageTransformer from './package.js';

describe('Package transformer for jsdocs', () => {
  test('should work with an empty package.json', () => {
    expect(
      packageTransformer({
        metapak: {
          configs: ['jsdocs'],
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
          "jsdoc-to-markdown": "^7.1.1",
        },
        "greenkeeper": {
          "ignore": [
            "jsdoc-to-markdown",
          ],
        },
        "metapak": {
          "configs": [
            "jsdocs",
          ],
          "data": {
            "files": "yolo.js",
          },
        },
        "scripts": {
          "doc": "echo "# API" > API.md; jsdoc2md yolo.js >> API.md && git add API.md",
          "precz": "npm run doc",
          "preversion": "npm run doc",
        },
      }
    `);
  });

  test('should work with a typescript setup', () => {
    expect(
      packageTransformer({
        metapak: {
          configs: ['jsdocs', 'typescript'],
          data: {
            files: 'yolo.ts',
            distFiles: 'yolo.js',
          },
        },
        greenkeeper: {
          ignore: [],
        },
      }),
    ).toMatchInlineSnapshot(`
      {
        "devDependencies": {
          "jsdoc-to-markdown": "^7.1.1",
        },
        "greenkeeper": {
          "ignore": [
            "jsdoc-to-markdown",
          ],
        },
        "metapak": {
          "configs": [
            "jsdocs",
            "typescript",
          ],
          "data": {
            "distFiles": "yolo.js",
            "files": "yolo.ts",
          },
        },
        "scripts": {
          "doc": "echo "# API" > API.md; jsdoc2md yolo.js >> API.md && git add API.md",
          "precz": "npm run doc",
          "preversion": "npm run doc",
        },
      }
    `);
  });
});
