import { describe, beforeEach, jest, test, expect } from '@jest/globals';
import assetsTransformer from './assets.js';
import type { LogService, FSService } from 'metapak';

describe('Assets transformer for www configs', () => {
  const fs = {
    readFileAsync: jest.fn<FSService['readFileAsync']>(),
    writeFileAsync: jest.fn<FSService['writeFileAsync']>(),
    mkdirpAsync: jest.fn<FSService['mkdirpAsync']>(),
    accessAsync: jest.fn<FSService['accessAsync']>(),
    readdirAsync: jest.fn<FSService['readdirAsync']>(),
    unlinkAsync: jest.fn<FSService['unlinkAsync']>(),
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

  test('should add www to ignored files', async () => {
    expect(
      await assetsTransformer(
        {
          name: '.gitignore',
          data: 'node_modules\n',
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
        "data": "node_modules
      www
      ",
        "dir": "/home/whoami/project/dir",
        "name": ".gitignore",
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
