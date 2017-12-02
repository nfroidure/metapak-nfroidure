'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const assetsTransformer = require('./assets');

describe('main', () => {
  describe('Assets transformer', () => {
    it('should fill author in the LICENCE file', () => {
      expect(
        assetsTransformer(
          {
            name: 'LICENSE',
            data: fs.readFileSync(
              path.join(__dirname, 'assets', 'LICENSE'),
              'utf-8'
            ),
          },
          {}
        )
      ).toMatchSnapshot();
    });

    it('should let pass other files', () => {
      assert.deepEqual(
        assetsTransformer(
          {
            name: 'YOLO',
            data: 'Carpe diem\n',
          },
          {}
        ),
        {
          name: 'YOLO',
          data: 'Carpe diem\n',
        }
      );
    });
  });
});
