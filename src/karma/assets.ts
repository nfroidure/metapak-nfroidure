import type { PackageAssetsTransformer } from 'metapak';

const transformer: PackageAssetsTransformer<
  {
    childPackage?: boolean;
  },
  unknown
> = async (file, packageConf) => {
  const {
    metapak: { data },
  } = packageConf;

  if ('.travis.yml' === file.name && !data.childPackage) {
    file.data = `${file.data}
before_install:
  - export CHROME_BIN=chromium-browser
services:
  - xvfb
`;
  }

  return file;
};

export default transformer;
