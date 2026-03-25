import type { PackageAssetsTransformer } from 'metapak';

const VSCODE_ESLINT_PLUGIN = 'dbaeumer.vscode-eslint';
const VSCODE_PRETTIER_PLUGIN = 'esbenp.prettier-vscode';

const transformer: PackageAssetsTransformer<
  { childPackage?: boolean; rootPackage?: boolean; files?: string },
  object
> = async (file, packageConf) => {
  const {
    metapak: { data, configs },
  } = packageConf;

  // Set types in ts config
  if ('.vscode/extensions.json' === file.name && !data.childPackage) {
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
  if ('eslint.config.mjs' === file.name) {
    if (data.rootPackage || !configs.includes('tsesm')) {
      file.data = '';
      return file;
    }
  }
  if ('eslint.config.js' === file.name) {
    if (data.rootPackage || configs.includes('tsesm')) {
      file.data = '';
      return file;
    }
  }
  return file;
};

export default transformer;
