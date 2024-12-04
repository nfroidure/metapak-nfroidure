import { YError } from 'yerror';
import { ensureScript } from '../lib.js';
import type { PackageJSONTransformer } from 'metapak';

const TYPES_COMMAND = 'npm run types';

const transformer: PackageJSONTransformer<
  { childPackage?: boolean; rootPackage?: boolean },
  {
    greenkeeper?: { ignore?: string[] };
  }
> = (packageConf) => {
  const {
    metapak: { data },
  } = packageConf;

  // Add the dev dependencies
  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.typescript = '^5.7.2';
  packageConf.devDependencies.rimraf = '^6.0.1';
  packageConf.devDependencies['@swc/core'] = '^1.10.0';
  packageConf.devDependencies['@swc/helpers'] = '^0.5.15';

  packageConf.scripts = packageConf.scripts || {};
  packageConf.scripts.types = data.rootPackage
    ? 'lerna run types'
    : "rimraf --glob 'dist/**/*.d.ts' && tsc --project . --declaration --emitDeclarationOnly --outDir dist";

  if (!data.rootPackage && !packageConf.types) {
    throw new YError('E_TYPES_NOT_DECLARED');
  }
  if (!data.childPackage) {
    packageConf.scripts.precz = ensureScript(
      packageConf.scripts.precz,
      TYPES_COMMAND,
    );
    packageConf.scripts.preversion = ensureScript(
      packageConf.scripts.preversion,
      TYPES_COMMAND,
    );
  }

  // Avoid GreenKeeper to update automatically added modules
  if ('metapak-nfroidure' !== packageConf.name && !data.childPackage) {
    packageConf.greenkeeper = {
      ignore: [
        ...new Set(
          (packageConf?.greenkeeper?.ignore || []).concat([
            'typescript',
            'rimraf',
            '@swc/core',
            '@swc/helpers',
          ]),
        ),
      ].filter((dependency) => packageConf?.devDependencies?.[dependency]),
    };
  }

  return packageConf;
};

export default transformer;
