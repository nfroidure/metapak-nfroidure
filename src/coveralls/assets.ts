import type { PackageAssetsTransformer } from 'metapak';

// TODO: Use a YAML parser instead?
const COVERALLS_SCRIPT = `      - name: Run coverage
        run: npm run cover
      - name: Report Coveralls
        uses: coverallsapp/github-action@v2
`;

const transformer: PackageAssetsTransformer<unknown, unknown> = async (
  file,
) => {
  if ('.github/workflows/test.yml' === file.name) {
    file.data = file.data + COVERALLS_SCRIPT;
  }

  return file;
};

export default transformer;
