import { ensureScript } from '../lib.js';
import config from '../config.js';
import type { PackageJSONTransformer } from 'metapak';

const DOCUMENTATION_SCRIPT = 'npm run doc';

const transformer: PackageJSONTransformer<
  {
    childPackage?: boolean;
    rootPackage?: boolean;
    distFiles?: string;
    files?: string;
  },
  {
    greenkeeper?: { ignore?: string[] };
  }
> = (packageConf) => {
  const {
    metapak: { data, configs },
  } = packageConf;

  // Adding documentation generation script
  packageConf.scripts = packageConf.scripts || {};
  packageConf.scripts.doc = data.rootPackage
    ? 'lerna run doc'
    : `echo "# API" > ${config.apiPath}; jsdoc2md ${
        configs.includes('typescript') || configs.includes('tsesm')
          ? data.distFiles
          : data.files
      } >> ${config.apiPath} && git add ${config.apiPath}`;

  if (!data.childPackage) {
    packageConf.scripts.precz = ensureScript(
      packageConf.scripts.precz,
      DOCUMENTATION_SCRIPT,
    );
    packageConf.scripts.preversion = ensureScript(
      packageConf.scripts.preversion,
      DOCUMENTATION_SCRIPT,
    );
  }

  // Add doc deps
  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies['jsdoc-to-markdown'] = '^8.0.0';

  // Avoid GreenKeeper to update automatically added modules
  if ('metapak-nfroidure' !== packageConf.name && !data.childPackage) {
    packageConf.greenkeeper = {
      ignore: [
        ...new Set(
          (packageConf.greenkeeper && packageConf.greenkeeper.ignore
            ? packageConf.greenkeeper.ignore
            : []
          ).concat(['jsdoc-to-markdown']),
        ),
      ],
    };
  }

  return packageConf;
};

export default transformer;
