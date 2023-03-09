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
  packageConf.devDependencies.typescript = '^4.9.5';
  packageConf.devDependencies.rimraf = '^4.4.0';

  packageConf.scripts = packageConf.scripts || {};
  packageConf.scripts.types = data.rootPackage
    ? 'lerna run types'
    : "rimraf --glob -f 'dist/**/*.d.ts' && tsc --project . --declaration --emitDeclarationOnly --outDir dist";

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
          (packageConf.greenkeeper && packageConf.greenkeeper.ignore
            ? packageConf.greenkeeper.ignore
            : []
          ).concat(['typescript']),
        ),
      ],
    };
  }

  return packageConf;
};

export default transformer;
