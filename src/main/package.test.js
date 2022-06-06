'use strict';

const packageTransformer = require('./package');

describe('Package transformer', () => {
  it('should work with an empty package.json', () => {
    expect(packageTransformer({})).toMatchSnapshot();
  });

  it('should work with a root package', () => {
    expect(
      packageTransformer({
        metapak: {
          data: {
            rootPackage: true,
          },
        },
      }),
    ).toMatchSnapshot();
  });

  it('should work with a child package.json', () => {
    expect(
      packageTransformer({
        metapak: {
          data: {
            childPackage: true,
          },
        },
      }),
    ).toMatchSnapshot();
  });

  it('should let existing lin & test scripts', () => {
    expect(
      packageTransformer({
        scripts: {
          test: 'echo "Testing is doubting"',
          lint: 'echo "Linting is fearing"',
        },
        metapak: {
          data: {
            childPackage: true,
          },
        },
      }),
    ).toMatchSnapshot();
  });
});
