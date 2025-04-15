/* eslint @stylistic/quote-props: ["error", "consistent"] */

import { addUseClientDirective } from './packages/plugins/add-use-client-directive'

import { defineConfig, Options } from 'tsup'

const commonBundleConfig: Options = {
  target: 'esnext',
  platform: 'browser', // Ensure cross-platform modules import a browser-compatible package
  splitting: true,
  dts: false,
  minify: true,
  noExternal: ['uuid'],
}

const commonTypesConfig: Options = {
  target: 'esnext',
  dts: { only: true },
}

const configs: Options[] = [
  {
    name: 'build',
    entry: {
      'core': 'packages/core/src/index.ts',
      'react': 'packages/react/src/index.ts',
    },
    format: ['esm', 'cjs'],
    plugins: [addUseClientDirective(['dist/react'])],
    ...commonBundleConfig,
  },
  {
    name: 'build-types',
    entry: {
      'core': 'packages/core/src/index.ts',
      'react': 'packages/react/src/index.ts',

    },
    ...commonTypesConfig,
  },
  {
    name: 'heyapi',
    entry: {
      'heyapi': 'packages/heyapi/src/index.ts',
    },
    format: ['esm', 'cjs'],
    ...commonBundleConfig,
  },
  {
    name: 'heyapi-types',
    entry: {
      'heyapi': 'packages/heyapi/src/index.ts',
    },
    ...commonTypesConfig,
  },
  {
    name: 'iife',
    entry: {
      'iife': 'packages/iife/src/index.ts',
    },
    format: ['iife'],
    globalName: 'mozAds',
    ...commonBundleConfig,
  },
]

export default defineConfig(configs)
