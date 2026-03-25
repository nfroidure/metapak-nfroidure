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
           node --run commitlint -- --edit "$1" || FAILURE=1;
           if [ "$FAILURE" = 1 ]; then
             exit 1;
           fi
         fi
       fi",
         ],
         "pre-commit": [
           "
       node --run precommit || FAILURE=1;
       if [ "$FAILURE" = 1 ]; then
         exit 1;
       fi",
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
           node --run commitlint -- --edit "$1" || FAILURE=1;
           if [ "$FAILURE" = 1 ]; then
             exit 1;
           fi
         fi
       fi",
         ],
         "pre-commit": [
           "
       node --run precommit || FAILURE=1;
       if [ "$FAILURE" = 1 ]; then
         exit 1;
       fi",
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
