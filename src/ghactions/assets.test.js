'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const assetsTransformer = require('./assets');

describe('GHActions', () => {
  describe('Assets transformer', () => {
    it('should fill the manifest', () => {
      expect(
        assetsTransformer(
          {
            name: '.github/workflows/test.yml',
            data: fs.readFileSync(
              path.join(
                __dirname,
                'assets',
                '_dot_github',
                'workflows',
                'test.yml'
              ),

              'utf-8'
            ),
          },

          {}
        )
      ).toMatchInlineSnapshot(`
        Object {
          "data": "name: Node.js CI

        on:
          push:
            branches: [ master ]
          pull_request:
            branches: [ master ]

        jobs:
          build:

            runs-on: ubuntu-latest

            strategy:
              matrix:
                node-version: [16.x, 18.x]

            services:
              redis:
                image: redis
                options: >-
                  --health-cmd \\"redis-cli ping\\"
                  --health-interval 10s
                  --health-timeout 5s
                  --health-retries 5
                ports:
                  - 6379:6379

            steps:
              - uses: actions/checkout@v3
              - name: Use Node.js \${{ matrix.node-version }}
                uses: actions/setup-node@v3
                with:
                  node-version: \${{ matrix.node-version }}
                  cache: 'npm'
              - run: npm ci
              - run: npm run build --if-present
              - run: npm run precz
        ",
          "name": "test.yml",
        }
      `);
    });

    it('should let pass other files', () => {
      assert.deepEqual(
        assetsTransformer(
          {
            name: 'YOLO',
            data: 'Carpe diem\n',
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
});
