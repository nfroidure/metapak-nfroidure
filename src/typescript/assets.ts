import type { PackageAssetsTransformer } from 'metapak';

const transformer: PackageAssetsTransformer<
  {
    types?: string;
    typesFiles?: string;
  },
  unknown
> = async (file, packageConf) => {
  // Set types in ts config
  if ('tsconfig.json' === file.name) {
    const {
      metapak: { data },
    } = packageConf;
    let contents = JSON.parse(file.data || '{}');

    if (data.types) {
      contents = Object.assign({}, contents, {
        ...contents,
        compilerOptions: {
          ...(contents.compilerOptions || {}),
          types: data.types,
        },
      });
    }

    if (data.typesFiles) {
      contents = Object.assign({}, contents, {
        include: [data.typesFiles],
      });
    }
    file.data = JSON.stringify(contents, null, 2);
  }
  return file;
};

export default transformer;
