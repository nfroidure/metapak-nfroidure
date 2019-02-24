'use strict';

const assert = require('assert');
const assetsTransformer = require('./assets');
const ASSETS_README_CONTENTS = `[//]: # ( )
[//]: # (This file is automatically generated by a \`metapak\`)
[//]: # (module. Do not change it except between the)
[//]: # (\`content:start/end\` flags, your changes would)
[//]: # (be overridden.)
[//]: # ( )
`;
const PROJECT_README_CONTENTS = `[//]: # ( )
[//]: # (This file is automatically generated by a \`metapak\`)
[//]: # (module. Do not change it except between the)
[//]: # (\`content:start/end\` flags, your changes would)
[//]: # (be overridden.)
[//]: # ( )
# module
> A great module!

[![NPM version](https://badge.fury.io/js/module.svg)](https://npmjs.org/package/module)
[![Dependency Status](https://david-dm.org/nfroidure/module.svg)](https://david-dm.org/nfroidure/module)
[![devDependency Status](https://david-dm.org/nfroidure/module/dev-status.svg)](https://david-dm.org/nfroidure/module#info=devDependencies)
[![Dependency Status](https://dependencyci.com/github/nfroidure/module/badge)](https://dependencyci.com/github/nfroidure/module)


[//]: # (::contents:start)

## Usage

Just require me


[//]: # (::contents:end)


# API
\`\`\`
toto.lol()
\`\`\`

# License
[MIT](https://github.com/nfroidure/module/blob/master/LICENSE)
`;
const PROJECT_API_CONTENTS = `
# API
\`\`\`
toto.lol()
\`\`\`
`;

describe('Assets transformer for www configs', () => {
  it('should build the README.md file', done => {
    const fs = {
      readFileAsync: jest.fn(),
    };
    const PROJECT_DIR = '/lol/';
    const log = {
      error: jest.fn(),
    };

    fs.readFileAsync.mockReturnValueOnce(
      Promise.resolve(PROJECT_README_CONTENTS)
    );
    fs.readFileAsync.mockReturnValueOnce(Promise.resolve(PROJECT_API_CONTENTS));

    assetsTransformer(
      {
        name: 'README.md',
        data: ASSETS_README_CONTENTS,
      },
      {
        name: 'module',
        description: 'A great module!',
        devDependencies: {},
        author: {
          name: 'Nicolas Froidure',
          email: 'nicolas.froidure@insertafter.com',
          url: 'http://insertafter.com/en/index.html',
        },
        contributors: [
          {
            name: 'John Doe',
          },
        ],
        license: 'MIT',
      },
      {
        PROJECT_DIR,
        fs,
        log,
      }
    )
      .then(file => {
        expect(file).toMatchSnapshot();
      })
      .then(done)
      .catch(done);
  });

  it('should build the README.md file with no badge', done => {
    const fs = {
      readFileAsync: jest.fn(),
    };
    const PROJECT_DIR = '/lol/';
    const log = {
      error: jest.fn(),
    };

    fs.readFileAsync.mockReturnValueOnce(
      Promise.resolve(PROJECT_README_CONTENTS)
    );
    fs.readFileAsync.mockReturnValueOnce(Promise.resolve(PROJECT_API_CONTENTS));

    assetsTransformer(
      {
        name: 'README.md',
        data: ASSETS_README_CONTENTS,
      },
      {
        name: 'module',
        description: 'A great module!',
        metapak: {
          data: {
            noBadge: true,
          },
        },
        devDependencies: {},
        author: {
          name: 'Nicolas Froidure',
          email: 'nicolas.froidure@insertafter.com',
          url: 'http://insertafter.com/en/index.html',
        },
        contributors: [
          {
            name: 'John Doe',
          },
        ],
        license: 'MIT',
      },
      {
        PROJECT_DIR,
        fs,
        log,
      }
    )
      .then(file => {
        expect(file).toMatchSnapshot();
      })
      .then(done)
      .catch(done);
  });

  it('should build the README.md file with additional badges', done => {
    const fs = {
      readFileAsync: jest.fn(),
    };
    const PROJECT_DIR = '/lol/';
    const log = {
      error: jest.fn(),
    };

    fs.readFileAsync.mockReturnValueOnce(
      Promise.resolve(PROJECT_README_CONTENTS)
    );
    fs.readFileAsync.mockReturnValueOnce(Promise.resolve(PROJECT_API_CONTENTS));

    assetsTransformer(
      {
        name: 'README.md',
        data: ASSETS_README_CONTENTS,
      },
      {
        name: 'module',
        description: 'A great module!',
        metapak: {
          configs: ['travis', 'codeclimate'],
          data: {},
        },
        devDependencies: {
          coveralls: '1.0.0',
        },
        author: {
          name: 'Nicolas Froidure',
          email: 'nicolas.froidure@insertafter.com',
          url: 'http://insertafter.com/en/index.html',
        },
        contributors: [
          {
            name: 'John Doe',
          },
        ],
        license: 'MIT',
      },
      {
        PROJECT_DIR,
        fs,
        log,
      }
    )
      .then(file => {
        expect(file).toMatchSnapshot();
      })
      .then(done)
      .catch(done);
  });

  it('should work with scoped packages', done => {
    const fs = {
      readFileAsync: jest.fn(),
    };
    const PROJECT_DIR = '/lol/';
    const log = {
      error: jest.fn(),
    };

    fs.readFileAsync.mockReturnValueOnce(
      Promise.resolve(PROJECT_README_CONTENTS)
    );
    fs.readFileAsync.mockReturnValueOnce(Promise.resolve(PROJECT_API_CONTENTS));

    assetsTransformer(
      {
        name: 'README.md',
        data: ASSETS_README_CONTENTS,
      },
      {
        name: '@scope/module',
        description: 'A great module!',
        metapak: {
          configs: ['travis', 'codeclimate'],
          data: {},
        },
        devDependencies: {
          coveralls: '1.0.0',
        },
        author: {
          name: 'Nicolas Froidure',
          email: 'nicolas.froidure@insertafter.com',
          url: 'http://insertafter.com/en/index.html',
        },
        contributors: [
          {
            name: 'John Doe',
          },
        ],
        license: 'MIT',
      },
      {
        PROJECT_DIR,
        fs,
        log,
      }
    )
      .then(file => {
        expect(file).toMatchSnapshot();
      })
      .then(done)
      .catch(done);
  });

  it('should work with scoped packages inside a monorepo', done => {
    const fs = {
      readFileAsync: jest.fn(),
    };
    const PROJECT_DIR = '/lol/';
    const log = {
      error: jest.fn(),
    };

    fs.readFileAsync.mockReturnValueOnce(
      Promise.resolve(PROJECT_README_CONTENTS)
    );
    fs.readFileAsync.mockReturnValueOnce(Promise.resolve(PROJECT_API_CONTENTS));

    assetsTransformer(
      {
        name: 'README.md',
        data: ASSETS_README_CONTENTS,
      },
      {
        name: '@scope/module',
        description: 'A great module!',
        metapak: {
          configs: ['travis', 'codeclimate'],
          data: {
            childPackage: true,
          },
        },
        devDependencies: {
          coveralls: '1.0.0',
        },
        author: {
          name: 'Nicolas Froidure',
          email: 'nicolas.froidure@insertafter.com',
          url: 'http://insertafter.com/en/index.html',
        },
        contributors: [
          {
            name: 'John Doe',
          },
        ],
        license: 'MIT',
      },
      {
        PROJECT_DIR,
        fs,
        log,
      }
    )
      .then(file => {
        expect(file).toMatchSnapshot();
      })
      .then(done)
      .catch(done);
  });

  it('should let pass other files', () => {
    assert.deepEqual(
      assetsTransformer(
        {
          name: 'YOLO',
          data: 'Carpe diem\n',
        },
        {
          name: 'yolo',
        },
        {}
      ),
      {
        name: 'YOLO',
        data: 'Carpe diem\n',
      }
    );
  });
});
