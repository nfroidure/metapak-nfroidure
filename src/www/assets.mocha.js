'use strict';

const assert = require('assert');
const assetsTransformer = require('./assets');

describe('Assets transformer for www configs', () => {
  it('should add www to ignored files', () => {
    assert.deepEqual(
      assetsTransformer({
        name: '.gitignore',
        data: 'node_modules\n',
      }, {}),
      {
        name: '.gitignore',
        data: 'node_modules\nwww\n',
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
