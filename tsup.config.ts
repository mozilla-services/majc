/* eslint @stylistic/quote-props: ["error", "consistent"] */

import { defineConfig, Options } from 'tsup'
import { prependDirective } from './packages/build/prependDirectivePlugin.ts'
import { ExpectedBuildOutput, validateBuildFiles, validatePackageExports } from './packages/build/validateBuild.ts'

const expectedBuildOutput: ExpectedBuildOutput = {
  // Output directory for build files. dist/ is the default for tsup.
  buildDir: 'dist/',
  // All modules we expect to have. Do not include chunks here as their hash can change.
  files: [
    'core.d.ts',
    'core.js',
    'core.mjs',
    'heyapi.d.ts',
    'heyapi.js',
    'heyapi.mjs',
    'iife.global.js',
    'react.d.ts',
    'react.js',
    'react.mjs',
  ],
  // Modules which we expect to have the "client only" directive.
  clientOnlyModules: [
    'react.js',
    'react.mjs',
  ],
}

const commonBundleConfig: Options = {
  target: 'esnext',
  platform: 'browser', // Ensure cross-platform modules import a browser-compatible package
  clean: true,
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
    splitting: true,
    entry: {
      'core': 'packages/core/src/index.ts',
      'react': 'packages/react/src/index.ts',
      'heyapi': 'packages/heyapi/src/index.ts',
    },
    format: ['esm', 'cjs'],
    plugins: [prependDirective('"use client"', ['dist/react'])],
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
    name: 'react-types',
    entry: {
      'react': 'packages/react/src/index.ts',
    },
    ...commonTypesConfig,
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

process.on('beforeExit', (code) => {
  if (code !== 0) {
    process.exit(code)
  }
  console.log('[POST-BUILD] Validating build files...')
  validateBuildFiles(expectedBuildOutput)
  validatePackageExports(expectedBuildOutput)
  console.log('[POST-BUILD] Validation successful! Build complete.')
})
