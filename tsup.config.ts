/* eslint @stylistic/quote-props: ["error", "consistent"] */

import { readFileSync, writeFileSync } from 'fs'
import { defineConfig, Options } from 'tsup'

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
    name: 'build-types',
    splitting: true,
    entry: {
      'core': 'packages/core/src/index.ts',
      'react': 'packages/react/src/index.ts',
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

export function prependDirective(directive: string, clientLibs: string[]): NonNullable<Options['plugins']>[number] {
  if (!Array.isArray(clientLibs)) {
    throw Error('ClientLibs given to addUseClientDirective plugin must be an array.')
  }
  return {
    name: 'add-use-client-directive',
    // At the end of the build step, directly add the useClientDirective to files with specified pattern

    buildEnd(ctx) {
      for (const file of ctx.writtenFiles) {
        for (const clientLibName of clientLibs) {
          if (file.name.startsWith(clientLibName)) {
            const fileContent = readFileSync(file.name, 'utf8')
            writeFileSync(file.name, `${directive};${fileContent}`)
            console.log(`Prepended "use client" directive to ${file.name}`)
          }
        }
      }
    },
  }
}

export default defineConfig(configs)
