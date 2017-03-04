'use strict';

const assert = require('assert');
const packageTransformer = require('./package');

describe('Package transformer', () => {
  it('should work with an empty package.json', () => {
    assert.deepEqual(
      packageTransformer({}),
      {
        author: 'Nicolas Froidure',
        dependencies: {
          debug: '2.6.1',
        },
        config: {
          commitizen: {
            path: './node_modules/cz-conventional-changelog',
          },
        },
        devDependencies: {
          'conventional-changelog-cli': '^1.2.0',
          commitizen: '^2.9.6',
          'cz-conventional-changelog': '^2.0.0',
          coveralls: '2.11.15',
          eslint: '3.16.0',
          'eslint-config-simplifield': '4.1.1',
          istanbul: '0.4.5',
          mocha: '3.2.0',
          'mocha-lcov-reporter': '1.3.0',
        },
        engines: {
          node: '>=6.9.5',
        },
        license: 'MIT',
        scripts: {
          cli: 'env NODE_ENV=${NODE_ENV:-cli}',
          cz: 'env NODE_ENV=${NODE_ENV:-cli} git cz',
          preversion: 'npm t && npm run lint',
          version: 'npm run changelog && git add CHANGELOG.md',
          changelog: 'conventional-changelog -p angular -i CHANGELOG.md -s',
        },
        version: '0.0.0',
        greenkeeper: {
          ignore: [
            'debug',
            'eslint', 'eslint-config-simplifield', 'mocha',
            'mocha-lcov-reporter', 'commitizen', 'cz-conventional-changelog',
            'coveralls', 'istanbul', 'conventional-changelog-cli',
          ],
        },
      }
    );
  });
});
