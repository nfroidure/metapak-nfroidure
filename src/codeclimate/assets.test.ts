import { describe, beforeEach, jest, test, expect } from '@jest/globals';
import _fs, { constants } from 'fs';
import path from 'path';
import assetsTransformer from './assets.js';
import type { LogService, FSService } from 'metapak';

describe('TravisCI', () => {
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
    test('should fill the manifest', async () => {
      expect(
        await assetsTransformer(
          {
            name: '.codeclimate.yml',
            dir: '/home/whoami/project/dir',
            data: _fs.readFileSync(
              path.join('src', 'codeclimate', 'assets', '_dot_codeclimate.yml'),
              'utf-8',
            ),
          },
          {
            metapak: {
              configs: ['codeclimate'],
              data: {
                files: 'src/*.js src/**/*.js',
                testsFiles: "test/*.js 'src/**/*.test.js'",
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
  "data": "# This file is automatically generated by a \`metapak\`
# module. Do not change it here, your changes would
# be overridden.

engines:
  eslint:
    enabled: true

ratings:
   paths:
   - "src/*.js src/**/*.js"
## Exclude test files.
exclude_patterns:
- "dist/"
- "**/node_modules/"
- "test/*.js",
- "src/**/*.test.js"
",
  "dir": "/home/whoami/project/dir",
  "name": ".codeclimate.yml",
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
              configs: ['codeclimate'],
              data: {
                files: 'src/*.js src/**/*.js',
                testsFiles: "test/*.js 'src/**/*.test.js'",
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
          "data": "Carpe diem
        ",
          "dir": "/home/whoami/project/dir",
          "name": "YOLO",
        }
      `);
    });
  });
});
