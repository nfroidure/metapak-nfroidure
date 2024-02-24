import { describe, beforeEach, jest, test, expect } from '@jest/globals';
import assetsTransformer from './assets.js';
import { constants } from 'fs';
import type { LogService, FSService } from 'metapak';

describe('Assets transformer for vscode extensions', () => {
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

  test('should add eslint extension', async () => {
    expect(
      await assetsTransformer(
        {
          name: '.vscode/extensions.json',
          data: '{}',
          dir: '/home/whoami/project/dir',
        },
        {
          metapak: {
            configs: ['eslint'],
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
  "data": "{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode"
  ]
}",
  "dir": "/home/whoami/project/dir",
  "name": ".vscode/extensions.json",
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
            configs: ['www'],
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
