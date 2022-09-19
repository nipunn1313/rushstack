// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import * as path from 'path';
import { PnpmOptionsConfiguration } from '../PnpmOptionsConfiguration';

const fakeCommonTempFolder: string = path.join(__dirname, 'common', 'temp');

describe(PnpmOptionsConfiguration.name, () => {
  it('throw error if pnpm-config.json does not exist', () => {
    expect(() => {
      PnpmOptionsConfiguration.loadFromJsonFileOrThrow(
        path.resolve(__dirname, 'pnpm-config-not-exist.json'),
        fakeCommonTempFolder
      );
    }).toThrow(/does not exist/);
  });

  it('validates unknown property', () => {
    expect(() =>
      PnpmOptionsConfiguration.loadFromJsonFileOrThrow(
        path.join(__dirname, 'jsonFiles', 'pnpm-config-unknown.json'),
        fakeCommonTempFolder
      )
    ).toThrow(/Additional properties not allowed: unknownProperty/);
  });

  it('loads overrides', () => {
    const pnpmConfiguration: PnpmOptionsConfiguration = PnpmOptionsConfiguration.loadFromJsonFileOrThrow(
      path.join(__dirname, 'jsonFiles', 'pnpm-config-overrides.json'),
      fakeCommonTempFolder
    );

    expect(pnpmConfiguration.globalOverrides).toEqual({
      foo: '^1.0.0',
      quux: 'npm:@myorg/quux@^1.0.0',
      'bar@^2.1.0': '3.0.0',
      'qar@1>zoo': '2'
    });
  });

  it('loads packageExtensions', () => {
    const pnpmConfiguration: PnpmOptionsConfiguration = PnpmOptionsConfiguration.loadFromJsonFileOrThrow(
      path.join(__dirname, 'jsonFiles', 'pnpm-config-packageExtensions.json'),
      fakeCommonTempFolder
    );

    expect(pnpmConfiguration.globalPackageExtensions).toEqual({
      'react-redux': {
        peerDependencies: {
          'react-dom': '*'
        }
      }
    });
  });

  it('loads neverBuiltDependencies', () => {
    const pnpmConfiguration: PnpmOptionsConfiguration = PnpmOptionsConfiguration.loadFromJsonFileOrThrow(
      path.join(__dirname, 'jsonFiles', 'pnpm-config-neverBuiltDependencies.json'),
      fakeCommonTempFolder
    );

    expect(pnpmConfiguration.globalNeverBuiltDependencies).toEqual(['fsevents', 'level']);
  });
});
