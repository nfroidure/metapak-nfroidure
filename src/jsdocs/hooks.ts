import config from '../config.js';
import type { GitHooksTransformer } from 'metapak';

const transformer: GitHooksTransformer<unknown, unknown> = (hooks) => {
  hooks['pre-commit'] = hooks['pre-commit'] || [];
  hooks['pre-commit'] = hooks['pre-commit'].filter(
    (hook) => hook !== `npm run doc && git add ${config.apiPath}`,
  );

  return hooks;
};

export default transformer;
