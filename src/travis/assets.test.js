'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const assetsTransformer = require('./assets');

describe('TravisCI', () => {
  describe('Assets transformer', () => {
    it('should fill the manifest', () => {
      expect(
        assetsTransformer(
          {
            name: '.travis.yml',
            data: fs.readFileSync(
              path.join(__dirname, 'assets', '_dot_travis.yml'),
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
