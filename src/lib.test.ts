import { describe, test, expect } from '@jest/globals';
import { ensureScript } from './lib.js';

describe('ensureScript', () => {
  test('should replace old script', () => {
    expect(
      ensureScript('', 'node --run test', 'npm run test'),
    ).toMatchInlineSnapshot(`"node --run test"`);
    expect(
      ensureScript('npm run test', 'node --run test', 'npm run test'),
    ).toMatchInlineSnapshot(`"node --run test"`);
    expect(
      ensureScript(
        'npm run jest && npm run test && npm run types',
        'node --run test',
        'npm run test',
      ),
    ).toMatchInlineSnapshot(
      `"npm run jest && node --run test && npm run types"`,
    );
  });

  test('should leave already added script', () => {
    expect(
      ensureScript('node --run test', 'node --run test'),
    ).toMatchInlineSnapshot(`"node --run test"`);
    expect(
      ensureScript(
        'node --run jest && node --run test && node --run types',
        'node --run test',
      ),
    ).toMatchInlineSnapshot(
      `"node --run jest && node --run test && node --run types"`,
    );
  });

  test('should add missing script', () => {
    expect(ensureScript('', 'node --run test')).toMatchInlineSnapshot(
      `"node --run test"`,
    );
    expect(
      ensureScript('node --run jest && node --run types', 'node --run test'),
    ).toMatchInlineSnapshot(
      `"node --run jest && node --run types && node --run test"`,
    );
  });
});
