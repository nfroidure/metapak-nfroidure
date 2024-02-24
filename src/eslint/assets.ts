import type { PackageAssetsTransformer } from 'metapak';

const VSCODE_ESLINT_PLUGIN = 'dbaeumer.vscode-eslint';
const VSCODE_PRETTIER_PLUGIN = 'esbenp.prettier-vscode';

const transformer: PackageAssetsTransformer<
  {
    typesFiles?: string;
    childPackage?: boolean;
  },
  unknown
> = async (file, packageConf) => {
  const {
    metapak: { data },
  } = packageConf;

  // Set types in ts config
  if ('.vscode/extensions.json' === file.name) {
    const contents = JSON.parse(file.data || '{}');

    contents.recommendations = contents.recommendations || [];

    if (!contents.recommendations.includes(VSCODE_ESLINT_PLUGIN)) {
      contents.recommendations.push(VSCODE_ESLINT_PLUGIN);
    }
    if (!contents.recommendations.includes(VSCODE_PRETTIER_PLUGIN)) {
      contents.recommendations.push(VSCODE_PRETTIER_PLUGIN);
    }

    contents.recommendations.sort();

    file.data = JSON.stringify(contents, null, 2);
  }
  if ('.vscode/settings.json' === file.name) {
    if (data.childPackage) {
      file.data = '';
    }
  }
  return file;
};

export default transformer;
