import type { PackageJSONTransformer } from 'metapak';

const transformer: PackageJSONTransformer<unknown, unknown> = (packageConf) => {
  packageConf.private = true;

  return packageConf;
};

export default transformer;
