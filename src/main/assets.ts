import config from '../config.js';
import type { PackageAssetsTransformer } from 'metapak';

const transformer: PackageAssetsTransformer<
  {
    childPackage?: boolean;
    rootPackage?: boolean;
    ignore?: string[];
  },
  unknown
> = async (file, packageConf) => {
  const {
    metapak: { data },
  } = packageConf;

  // Rename dot files the right way
  if (file.name.startsWith('_dot_')) {
    file.name = file.name.replace('_dot_', '.');
  }

  // Add author to the license
  if ('LICENSE' === file.name) {
    file.data = file.data.replace(
      /<copyright holders>/gm,
      packageConf.author &&
        typeof packageConf.author === 'object' &&
        'name' in packageConf.author
        ? packageConf.author.name
        : '',
    );
  }

  // Add NodeJS LTS where needed
  if (['.github/ISSUE_TEMPLATE'].includes(file.name)) {
    file.data = file.data.replace(/<lastNodeLTS>/gm, config.lastNodeLTS);
  }

  // Add .gitignore additionnal files
  if (file.name.endsWith('.gitignore') && data.ignore && data.ignore.length) {
    file.data =
      file.data +
      '\n' +
      '# Project custom ignored file\n' +
      data.ignore.join('\n') +
      '\n';
  }

  // Avoid adding wrong files in child packages
  if (
    data.childPackage &&
    [
      '.github/CODE_OF_CONDUCT.md',
      '.github/CONTRIBUTING',
      '.github/ISSUE_TEMPLATE',
      '.github/FUNDING.yml',
      '.github/PULL_REQUEST_TEMPLATE',
      '.editorconfig',
      '.gitattributes',
      '.gitignore',
    ].includes(file.name)
  ) {
    file.data = '';
  }

  return file;
};

export default transformer;
