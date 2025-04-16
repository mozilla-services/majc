/* eslint @stylistic/quote-props: ["error", "consistent"] */

import { defineConfig, Options } from 'tsup'
import { prependDirective } from './packages/build/prependDirectivePlugin.ts'
import { ExpectedBuildOutput, validateBuildFiles, validatePackageExports } from './packages/build/validateBuild.ts'

// Get any environment variables passed to tsup and make them
// available here.
const env: Record<string, string> = process.argv.reduce((acc, curr) => {
  if (curr.startsWith('--env.')) {
    const [key, value] = curr.substring(6).split('=')
    acc[key] = value
  }

  return acc
}, {})

const commonBundleConfig: Options = {
  target: 'esnext',
  platform: 'browser', // Ensure cross-platform modules import a browser-compatible package
  clean: true,
  dts: false,
  minify: env.NODE_ENV === 'production',
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
