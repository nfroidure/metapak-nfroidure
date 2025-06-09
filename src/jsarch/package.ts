import { ensureScript } from '../lib.js';
import type { PackageJSONTransformer } from 'metapak';

const ARCHITECTURE_SCRIPT = 'node --run architecture';

const transformer: PackageJSONTransformer<
  { childPackage?: boolean; rootPackage?: boolean; files: string },
  {
    greenkeeper?: { ignore?: string[] };
  }
> = (packageConf) => {
  const {
    metapak: { data, configs },
  } = packageConf;

  // Adding architecture generation script
  packageConf.scripts = packageConf.scripts || {};
  packageConf.scripts.architecture = data.rootPackage
    ? 'lerna run architecture'
    : 'jsarch ' + data.files + ' > ARCHITECTURE.md && git add ARCHITECTURE.md';

  if (!data.childPackage) {
    packageConf.scripts.precz = ensureScript(
      packageConf.scripts.precz,
      ARCHITECTURE_SCRIPT,
      'npm run architecture',
    );
    packageConf.scripts.preversion = ensureScript(
      packageConf.scripts.preversion,
      ARCHITECTURE_SCRIPT,
      'npm run architecture',
    );
  }

  // Special configuration for TypeScript
  if (
    (configs.includes('typescript') || configs.includes('tsesm')) &&
    !packageConf.jsarch
  ) {
    packageConf.jsarch = {
      parserOptions: {
        plugins: ['typescript'],
      },
    };
  }

  // Add jsarch dep
  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.jsarch = '^6.1.2';

  // Avoid GreenKeeper to update automatically added modules
  if ('metapak-nfroidure' !== packageConf.name && !data.childPackage) {
    packageConf.greenkeeper = {
      ignore: [
        ...new Set((packageConf?.greenkeeper?.ignore || []).concat(['jsarch'])),
      ].filter((dependency) => packageConf?.devDependencies?.[dependency]),
    };
  }

  return packageConf;
};

export default transformer;
