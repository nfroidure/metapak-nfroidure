import type { PackageAssetsTransformer } from 'metapak';

const transformer: PackageAssetsTransformer<
  {
    files?: string;
    testsFiles?: string;
  },
  unknown
> = async (file, packageConf) => {
  // Set files to code climate
  if ('.codeclimate.yml' === file.name) {
    const {
      metapak: { data },
    } = packageConf;

    if (data.files) {
      file.data = file.data.replace(/\*\*\.js/gm, data.files);
    }
    if (data.testsFiles) {
      file.data += `## Exclude test files.
exclude_patterns:
- "dist/"
- "**/node_modules/"${data.testsFiles.split(' ').map(
        (files) => `
- "${
          files.startsWith("'") && files.endsWith("'")
            ? files.slice(1, -1)
            : files
        }"`,
      )}
`;
    }
  }

  return file;
};

export default transformer;
