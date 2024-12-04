import { ensureScript } from '../lib.js';
import { YError } from 'yerror';
import type { PackageJSONTransformer } from 'metapak';

const MOCHA_COMMAND = 'npm run mocha';

const transformer: PackageJSONTransformer<
  {
    childPackage?: boolean;
    testsFiles?: string;
  },
  {
    greenkeeper?: { ignore?: string[] };
  }
> = (packageConf) => {
  const {
    metapak: { data, configs },
  } = packageConf;

  if (!data.testsFiles) {
    throw new YError('E_NO_TEST_FILES', packageConf.metapak.data);
  }

  packageConf.scripts = packageConf.scripts || {};
  if (configs.includes('babel')) {
    if (configs.indexOf('babel') > configs.indexOf('mocha')) {
      throw new YError('E_BAD_CONFIG_ORDER', 'babel', 'mocha');
    }
    packageConf.scripts.mocha = `mocha --require '@babel/register' ${data.testsFiles}`;
  } else {
    packageConf.scripts.mocha = `mocha ${data.testsFiles}`;
  }

  packageConf.scripts.test = ensureScript(
    packageConf.scripts.test,
    MOCHA_COMMAND,
  );
  packageConf.scripts.cover =
    'nyc npm test && nyc report --reporter=html --reporter=text';

  packageConf.devDependencies = packageConf.devDependencies || {};
  packageConf.devDependencies.mocha = '^11.0.1';
  packageConf.devDependencies.nyc = '^17.1.0';

  // Ignore test files
  packageConf.nyc = packageConf.nyc || {
    exclude: [data.testsFiles],
  };

  // Remove old coveralls configs
  delete packageConf.scripts.coveralls;
  delete packageConf.devDependencies.coveralls;

  delete packageConf.devDependencies['mocha-lcov-reporter'];
  delete packageConf.devDependencies.istanbul;

  if ('metapak-nfroidure' !== packageConf.name && !data.childPackage) {
    packageConf.greenkeeper = {
      ignore: [
        ...new Set(
          (packageConf?.greenkeeper?.ignore || []).concat(['mocha', 'nyc']),
        ),
      ].filter((dependency) => packageConf?.devDependencies?.[dependency]),
    };
  }

  return packageConf;
};

export default transformer;
