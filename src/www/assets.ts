import type { PackageAssetsTransformer } from 'metapak';

const transformer: PackageAssetsTransformer<unknown, unknown> = async (
  file,
) => {
  // Add www to ignored files
  if ('.gitignore' === file.name) {
    file.data += 'www\n';
  }

  return file;
};

export default transformer;
