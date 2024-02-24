import { describe, beforeEach, jest, test, expect } from '@jest/globals';
import _fs, { constants } from 'fs';
import path from 'path';
import assetsTransformer from './assets.js';
import type { LogService, FSService } from 'metapak';

describe('Coveralls', () => {
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
    test('should amend the test workflow', async () => {
      expect(
        await assetsTransformer(
          {
            name: '.github/workflows/test.yml',
            dir: '/home/whoami/project/dir',
            data: _fs.readFileSync(
              path.join(
                'src',
                'ghactions',
                'assets',
                '_dot_github',
                'workflows',
                'test.yml',
              ),

              'utf-8',
            ),
          },
          {
            metapak: {
              configs: ['ghactions'],
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
  "data": "name: Node.js CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js \${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: \${{ matrix.node-version }}
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Run pre-commit tests
        run: npm run precz
      - name: Run coverage
        run: npm run cover
      - name: Report Coveralls
        uses: coverallsapp/github-action@v2
",
  "dir": "/home/whoami/project/dir",
  "name": ".github/workflows/test.yml",
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
              configs: ['ghactions'],
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
  });
});