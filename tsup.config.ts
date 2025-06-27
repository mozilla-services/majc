/* eslint @stylistic/quote-props: ["error", "consistent"] */

import { defineConfig, Options } from "tsup"
import { readFileSync, writeFileSync } from "fs"
import { ExpectedBuildOutput, validateBuildFiles } from "./scripts/validateBuild.ts"

const expectedBuildOutput: ExpectedBuildOutput = {
  buildDir: "dist/",
  files: [
    "core.js",
    "core.mjs",
    "core.d.ts",
    "react.d.ts",
    "react.js",
    "react.mjs",
    "heyapi.d.ts",
    "heyapi.js",
    "heyapi.mjs",
    "iife.global.js",
  ],
  clientOnlyModules: [
    "react.js",
    "react.mjs",
  ],
}

// Get any environment variables passed to tsup and make them
// available here.
const env: Record<string, string> = process.argv.reduce((acc, curr) => {
  if (curr.startsWith("--env.")) {
    const [key, value] = curr.substring(6).split("=")
    acc[key] = value
  }

  return acc
}, {})

const commonBundleConfig: Options = {
  target: "esnext",
  platform: "browser", // Ensure cross-platform modules import a browser-compatible package
  clean: true,
  dts: false,
  minify: env.NODE_ENV === "production",
  noExternal: ["uuid"],
}

const commonTypesConfig: Options = {
  target: "esnext",
  dts: { only: true },
}

const configs: Options[] = [
  {
    name: "build",
    splitting: true,
    entry: {
      "core": "packages/core/src/index.ts",
      "react": "packages/react/src/index.ts",
      "heyapi": "packages/heyapi/src/index.ts",
    },
    format: ["esm", "cjs"],
    plugins: [prependDirective("\"use client\"", ["dist/react"])],
    ...commonBundleConfig,
  },
  {
    name: "core-types",
    entry: {
      "core": "packages/core/src/index.ts",
    },
    ...commonTypesConfig,
  },
  {
    name: "react-types",
    entry: {
      "react": "packages/react/src/index.ts",
    },
    ...commonTypesConfig,
  },
  {
    name: "heyapi-types",
    entry: {
      "heyapi": "packages/heyapi/src/index.ts",
    },
    ...commonTypesConfig,
  },
  {
    name: "iife",
    entry: {
      "iife": "packages/iife/src/index.ts",
    },
    format: ["iife"],
    globalName: "mozAds",
    ...commonBundleConfig,
  },
]

export default defineConfig(configs)

process.on("beforeExit", (code) => {
  if (code !== 0) {
    process.exit(code)
  }
  console.log("[POST-BUILD] Validating build files...")
  validateBuildFiles(expectedBuildOutput)
  console.log("[POST-BUILD] Validation successful! Build complete.")
})

function prependDirective(directive: string, filePatterns: string[]): NonNullable<Options["plugins"]>[number] {
  if (!Array.isArray(filePatterns)) {
    throw Error("FilePatterns given to prependDirective plugin must be an array.")
  }
  return {
    name: "prepend-directive",
    // At the end of the build step, directly prepend the specified directive to files with specified pattern

    buildEnd(ctx) {
      for (const file of ctx.writtenFiles) {
        for (const filePattern of filePatterns) {
          if (file.name.startsWith(filePattern)) {
            const fileContent = readFileSync(file.name, "utf8")
            writeFileSync(file.name, `${directive};${fileContent}`)
            console.log(`Prepended ${directive} directive to ${file.name}`)
          }
        }
      }
    },
  }
}
