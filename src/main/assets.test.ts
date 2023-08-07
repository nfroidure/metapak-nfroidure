import { describe, beforeEach, jest, test, expect } from '@jest/globals';
import _fs, { constants } from 'fs';
import path from 'path';
import assetsTransformer from './assets.js';
import type { LogService, FSService } from 'metapak';

describe('main', () => {
  const fs = {
    readFileAsync: jest.fn<FSService['readFileAsync']>(),
    writeFileAsync: jest.fn<FSService['writeFileAsync']>(),
    mkdirpAsync: jest.fn<FSService['mkdirpAsync']>(),
    accessAsync: jest.fn<FSService['accessAsync']>(),
    readdirAsync: jest.fn<FSService['readdirAsync']>(),
    unlinkAsync: jest.fn<FSService['unlinkAsync']>(),
    constants,
  };
  const PROJECT_DIR = '/lol/';
  const log = jest.fn<LogService>();

  beforeEach(() => {
    fs.readFileAsync.mockReset();
    fs.writeFileAsync.mockReset();
    fs.mkdirpAsync.mockReset();
    fs.accessAsync.mockReset();
    fs.readdirAsync.mockReset();
    fs.unlinkAsync.mockReset();
    log.mockReset();
  });

  describe('Assets transformer', () => {
    test('should fill author in the LICENCE file', async () => {
      expect(
        await assetsTransformer(
          {
            name: 'LICENSE',
            data: _fs.readFileSync(
              path.join('src', 'main', 'assets', 'LICENSE'),
              'utf-8',
            ),

            dir: '/home/whoami/project/dir',
          },
          {
            metapak: {
              configs: ['main'],
              data: {},
            },
            author: { name: 'Nicolas Froidure' },
          },
          {
            PROJECT_DIR,
            fs,
            log,
          },
        ),
      ).toMatchInlineSnapshot(`
        {
          "data": "The MIT License (MIT)
        Copyright © 2017 Nicolas Froidure

        Permission is hereby granted, free of charge, to any person obtaining a copy
        of this software and associated documentation files (the “Software”), to deal
        in the Software without restriction, including without limitation the rights
        to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
        copies of the Software, and to permit persons to whom the Software is
        furnished to do so, subject to the following conditions:

        The above copyright notice and this permission notice shall be included in
        all copies or substantial portions of the Software.

        THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
        THE SOFTWARE.
        ",
          "dir": "/home/whoami/project/dir",
          "name": "LICENSE",
        }
      `);
    });

    test('should let pass other files', async () => {
      expect(
        await assetsTransformer(
          {
            name: 'YOLO',
            data: 'Carpe diem\n',
            dir: '/home/whoami/project/dir',
          },
          {
            metapak: {
              configs: ['main'],
              data: {},
            },
          },
          {
            PROJECT_DIR,
            fs,
            log,
          },
        ),
      ).toMatchInlineSnapshot(`
        {
          "data": "Carpe diem
        ",
          "dir": "/home/whoami/project/dir",
          "name": "YOLO",
        }
      `);
    });

    test('should empty child package files', async () => {
      expect(
        await assetsTransformer(
          {
            name: '_dot_gitignore',
            data: 'dist\n',
            dir: '/home/whoami/project/dir',
          },
          {
            metapak: {
              configs: ['main'],
              data: {
                childPackage: true,
              },
            },
          },
          {
            PROJECT_DIR,
            fs,
            log,
          },
        ),
      ).toMatchInlineSnapshot(`
        {
          "data": "",
          "dir": "/home/whoami/project/dir",
          "name": ".gitignore",
        }
      `);
    });
  });
});
