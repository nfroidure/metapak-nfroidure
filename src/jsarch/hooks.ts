import type { GitHooksTransformer } from 'metapak';

const transformer: GitHooksTransformer<unknown, unknown> = (hooks) => {
  hooks['pre-commit'] = hooks['pre-commit'] || [];
  hooks['pre-commit'] = hooks['pre-commit'].filter(
    (hook) => hook !== 'npm run architecture && git add ARCHITECTURE.md',
  );

  return hooks;
};

export default transformer;
