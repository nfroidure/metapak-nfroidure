import { describe, test, expect } from '@jest/globals';
import hooksTransformer from './hooks.js';

describe('main', () => {
  describe('Hooks transformer', () => {
    test('should add pre-commit hooks', () => {
      expect(
        hooksTransformer(
          {},
          {
            metapak: {
              configs: ['ghactions'],
              data: {},
            },
          },
        ),
      ).toMatchInlineSnapshot(`
        {
          "commit-msg": [
            "
        if [ "$NODE_ENV" != "cli" ] ; then
          if grep -q '^[0-9]\\+.[0-9]\\+.[0-9]\\+$' "$1" ; then
            exit 0;
          else
            echo "⚠️ - Please commit with \\\`npm run cz -- (usual commit args)\\\`"
            echo "💊 - To bypass commitizen add \\\`NODE_ENV=cli\\\` to your command"
            echo "💡 - You may want to set an alias: \\\`alias gicz='npm run cz -- '\\\`"
            exit 1;
          fi
        fi",
          ],
          "pre-commit": [
            "
        if ! git diff-files --quiet --ignore-submodules ; then
          echo "⚠️ - Unstaged files found:"
          echo $(git diff-files --shortstat)
        fi",
          ],
        }
      `);
    });

    test('should let pre-commit hooks empty for child packages', () => {
      expect(
        hooksTransformer(
          {},
          {
            metapak: {
              configs: ['ghactions'],
              data: {},
            },
          },
        ),
      ).toMatchInlineSnapshot(`
        {
          "commit-msg": [
            "
        if [ "$NODE_ENV" != "cli" ] ; then
          if grep -q '^[0-9]\\+.[0-9]\\+.[0-9]\\+$' "$1" ; then
            exit 0;
          else
            echo "⚠️ - Please commit with \\\`npm run cz -- (usual commit args)\\\`"
            echo "💊 - To bypass commitizen add \\\`NODE_ENV=cli\\\` to your command"
            echo "💡 - You may want to set an alias: \\\`alias gicz='npm run cz -- '\\\`"
            exit 1;
          fi
        fi",
          ],
          "pre-commit": [
            "
        if ! git diff-files --quiet --ignore-submodules ; then
          echo "⚠️ - Unstaged files found:"
          echo $(git diff-files --shortstat)
        fi",
          ],
        }
      `);
    });
  });
});
