'use strict';

const assert = require('assert');
const assetsTransformer = require('./assets');

describe('Assets transformer', () => {
  it('should fill author in the LICENCE file', () => {
    assert.deepEqual(
      assetsTransformer({
        name: 'LICENSE',
        data: 'The MIT License (MIT)\nCopyright © 2017 <copyright holders>\n',
      }, {}),
      {
        name: 'LICENSE',
        data: 'The MIT License (MIT)\nCopyright © 2017 Nicolas Froidure\n',
      }
    );
  });

  it('should fill author in the LICENCE file', () => {
    assert.deepEqual(
      assetsTransformer({
        name: '.codeclimate.yml',
        data: '   paths:\n   - "**.js"\n',
      }, { metapak: { data: { files: 'src/*.js src/**/*.js' } } }),
      {
        name: '.codeclimate.yml',
        data: '   paths:\n   - "src/*.js src/**/*.js"\n',
      }
    );
  });

  it('should let pass other files', () => {
    assert.deepEqual(
      assetsTransformer({
        name: 'YOLO',
        data: 'Carpe diem\n',
      }, {}),
      {
        name: 'YOLO',
        data: 'Carpe diem\n',
      }
    );
  });
});
