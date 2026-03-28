import { describe, test, expect } from '@jest/globals';
import packageTransformer from './package.js';

describe('Package transformer', () => {
  test('should work with an empty package.json', () => {
    expect(
      packageTransformer({
        metapak: {
          configs: ['main'],
          data: {},
        },
      }),
    ).toMatchInlineSnapshot(`
     {
       "author": {
         "email": "nicolas.froidure@insertafter.com",
         "name": "Nicolas Froidure",
         "url": "https://insertafter.com/en/index.html",
       },
       "contributors": [],
       "devDependencies": {
         "@commitlint/cli": "^20.5.0",
         "@commitlint/config-conventional": "^20.5.0",
         "conventional-changelog": "^7.2.0",
       },
       "engines": {
         "node": ">=24.14.0",
       },
       "files": [
         "src",
         "LICENSE",
         "README.md",
         "CHANGELOG.md",
       ],
       "funding": {
         "type": "individual",
         "url": "https://github.com/sponsors/nfroidure",
       },
       "license": "MIT",
       "metapak": {
         "configs": [
           "main",
         ],
         "data": {},
       },
       "scripts": {
         "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s && git add CHANGELOG.md",
         "cli": "env NODE_ENV=\${NODE_ENV:-cli}",
         "commitlint": "commitlint",
         "format": "echo "WARNING: No formatter specified"",
         "lint": "echo "WARNING: No linter specified"",
         "precommit": "node --run test && node --run lint && node --run metapak -- -s",
         "preversion": "node --run test && node --run lint && node --run metapak -- -s",
         "test": "echo "WARNING: No tests specified"",
         "version": "node --run changelog",
       },
       "version": "0.0.0",
     }
    `);
  });

  test('should work with a root package', () => {
    expect(
      packageTransformer({
        metapak: {
          configs: ['main'],
          data: {
            rootPackage: true,
          },
        },
      }),
    ).toMatchInlineSnapshot(`
     {
       "author": {
         "email": "nicolas.froidure@insertafter.com",
         "name": "Nicolas Froidure",
         "url": "https://insertafter.com/en/index.html",
       },
       "contributors": [],
       "devDependencies": {
         "@commitlint/cli": "^20.5.0",
         "@commitlint/config-conventional": "^20.5.0",
         "conventional-changelog": "^7.2.0",
       },
       "engines": {
         "node": ">=24.14.0",
       },
       "files": [
         "src",
         "LICENSE",
         "README.md",
         "CHANGELOG.md",
       ],
       "funding": {
         "type": "individual",
         "url": "https://github.com/sponsors/nfroidure",
       },
       "license": "MIT",
       "metapak": {
         "configs": [
           "main",
         ],
         "data": {
           "rootPackage": true,
         },
       },
       "scripts": {
         "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s -k packages/undefined/package.json && git add CHANGELOG.md",
         "cli": "env NODE_ENV=\${NODE_ENV:-cli}",
         "commitlint": "commitlint",
         "format": "lerna run format",
         "lint": "lerna run lint",
         "precommit": "node --run test && node --run lint && node --run lerna -- run --parallel metapak -- -s && node --run metapak -- -s",
         "preversion": "node --run test && node --run lint && node --run lerna -- run --parallel metapak -- -s && node --run metapak -- -s",
         "test": "lerna run test",
         "version": "node --run changelog",
       },
     }
    `);
  });

  test('should work with a child package.json', () => {
    expect(
      packageTransformer({
        metapak: {
          configs: ['main'],
          data: {
            childPackage: true,
          },
        },
      }),
    ).toMatchInlineSnapshot(`
     {
       "author": {
         "email": "nicolas.froidure@insertafter.com",
         "name": "Nicolas Froidure",
         "url": "https://insertafter.com/en/index.html",
       },
       "contributors": [],
       "engines": {
         "node": ">=24.14.0",
       },
       "files": [
         "src",
         "LICENSE",
         "README.md",
         "CHANGELOG.md",
       ],
       "funding": {
         "type": "individual",
         "url": "https://github.com/sponsors/nfroidure",
       },
       "license": "MIT",
       "metapak": {
         "configs": [
           "main",
         ],
         "data": {
           "childPackage": true,
         },
       },
       "scripts": {
         "cli": "env NODE_ENV=\${NODE_ENV:-cli}",
         "format": "echo "WARNING: No formatter specified"",
         "lint": "echo "WARNING: No linter specified"",
         "test": "echo "WARNING: No tests specified"",
       },
       "version": "0.0.0",
     }
    `);
  });

  test('should let existing lin & test scripts', () => {
    expect(
      packageTransformer({
        scripts: {
          test: 'echo "Testing is doubting"',
          lint: 'echo "Linting is fearing"',
        },
        metapak: {
          configs: ['main'],
          data: {
            childPackage: true,
          },
        },
      }),
    ).toMatchInlineSnapshot(`
     {
       "author": {
         "email": "nicolas.froidure@insertafter.com",
         "name": "Nicolas Froidure",
         "url": "https://insertafter.com/en/index.html",
       },
       "contributors": [],
       "engines": {
         "node": ">=24.14.0",
       },
       "files": [
         "src",
         "LICENSE",
         "README.md",
         "CHANGELOG.md",
       ],
       "funding": {
         "type": "individual",
         "url": "https://github.com/sponsors/nfroidure",
       },
       "license": "MIT",
       "metapak": {
         "configs": [
           "main",
         ],
         "data": {
           "childPackage": true,
         },
       },
       "scripts": {
         "cli": "env NODE_ENV=\${NODE_ENV:-cli}",
         "format": "echo "WARNING: No formatter specified"",
         "lint": "echo "Linting is fearing"",
         "test": "echo "Testing is doubting"",
       },
       "version": "0.0.0",
     }
    `);
  });
});
