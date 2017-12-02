'use strict';

const assert = require('assert');
const sinon = require('sinon');
const assetsTransformer = require('./assets');

describe('Assets transformer for www configs', () => {
  it('should build the README.md file', done => {
    const fs = {
      readFileAsync: sinon.stub(),
    };
    const PROJECT_DIR = '/lol/';
    const log = {
      error: sinon.stub,
    };

    fs.readFileAsync
      .onFirstCall()
      .returns(Promise.resolve('## Usage\nJust require me\n'));
    fs.readFileAsync.onSecondCall().returns(Promise.resolve(''));

    assetsTransformer(
      {
        name: 'README.md',
        data: '<!-- something -->\n',
      },
      {
        name: 'module',
        description: 'A great module!',
        devDependencies: {},
        license: 'MIT',
      },
      {
        PROJECT_DIR,
        fs,
        log,
      }
    )
      .then(file => {
        assert.deepEqual(file, {
          name: 'README.md',
          data:
            '<!-- something -->\n' +
            '# module\n' +
            '> A great module!\n\n' +
            '[![NPM version](https://badge.fury.io/js/module.svg)]' +
            '(https://npmjs.org/package/module)\n' +
            '[![Build status](https://secure.travis-ci.org/nfroidure/module.svg)]' +
            '(https://travis-ci.org/nfroidure/module)\n' +
            '[![Dependency Status](https://david-dm.org/nfroidure/module.svg)]' +
            '(https://david-dm.org/nfroidure/module)\n' +
            '[![devDependency Status](https://david-dm.org/nfroidure/module/dev-status.svg)]' +
            '(https://david-dm.org/nfroidure/module#info=devDependencies)\n' +
            '[![Code Climate](https://codeclimate.com/github/nfroidure/module.svg)]' +
            '(https://codeclimate.com/github/nfroidure/module)\n' +
            '[![Dependency Status](https://dependencyci.com/github/nfroidure/module/badge)]' +
            '(https://dependencyci.com/github/nfroidure/module)\n\n' +
            '## Usage\n' +
            'Just require me\n\n' +
            '# License\n' +
            '[MIT](https://github.com/nfroidure/module/blob/master/LICENSE)\n',
        });
      })
      .then(done)
      .catch(done);
  });

  it('should let pass other files', () => {
    assert.deepEqual(
      assetsTransformer(
        {
          name: 'YOLO',
          data: 'Carpe diem\n',
        },
        {},
        {}
      ),
      {
        name: 'YOLO',
        data: 'Carpe diem\n',
      }
    );
  });
});
