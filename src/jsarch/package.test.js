'use strict';

const packageTransformer = require('./package');

describe('Package transformer for jsdocs', () => {
  it('should work with an empty package.json', () => {
    expect(
      packageTransformer({
        metapak: {
          data: {
            files: 'yolo.js',
          },
        },
        greenkeeper: {
          ignore: [],
        },
      })
    ).toMatchSnapshot();
  });

  it('should work with child package', () => {
    expect(
      packageTransformer({
        metapak: {
          data: {
            childPackage: true,
            files: 'yolo.js',
          },
        },
        greenkeeper: {
          ignore: [],
        },
      })
    ).toMatchSnapshot();
  });
});
