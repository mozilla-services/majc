/* eslint @stylistic/quote-props: ["error", "consistent"] */

import { defineConfig, Options } from 'tsup'

const commonBundleConfig: Options = {
  target: 'esnext',
  platform: 'browser', // Ensure cross-platform modules import a browser-compatible package
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
    name: 'core',
    entry: {
      'core': 'packages/core/src/index.ts',
    },
    format: ['esm', 'cjs'],
    ...commonBundleConfig,
  },
  {
    name: 'core-types',
    entry: {
      'core': 'packages/core/src/index.ts',
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
  {
    name: 'react',
    entry: {
      'react': 'packages/react/src/index.ts',
    },
    format: ['esm', 'cjs'],
    external: ['react'], // Prevent including all of the 'react' package in our own bundle
    ...commonBundleConfig,
  },
  {
    name: 'react-types',
    entry: {
      'react': 'packages/react/src/index.ts',
    },
    ...commonTypesConfig,
  },
]

export default defineConfig(configs)
