/* eslint @stylistic/quote-props: ["error", "consistent"] */

import { defineConfig, type Options } from "tsdown"
import { readFileSync, writeFileSync } from "fs"
import { type ExpectedBuildOutput, validateBuildFiles } from "./scripts/validateBuild.ts"

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
    "iife.iife.js",
  ],
  clientOnlyModules: [
    "react.js",
    "react.mjs",
  ],
}

// Get any environment variables passed to tsdown and make them
// available here.
const env = process.argv.reduce((acc, curr) => {
  if (curr.startsWith("--env.")) {
    const [key, value] = curr.substring(6).split("=")
    acc[key] = value
  }

  return acc
}, {} as Record<string, string>)

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
  dts: true,
  format: ["cjs"], // Generate .d.ts files (not .d.mts)
}

const configs: Options[] = [
  {
    name: "build",
    minify: true,
    entry: {
      "core": "packages/core/src/index.ts",
      "react": "packages/react/src/index.ts",
      "heyapi": "packages/heyapi/src/index.ts",
    },
    format: ["esm", "cjs"],
    plugins: [prependDirective("\"use client\"", ["react"])],
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

type PluginOption = NonNullable<Options["plugins"]>

function prependDirective(directive: string, filePatterns: string[]): PluginOption {
  if (!Array.isArray(filePatterns)) {
    throw Error("FilePatterns given to prependDirective plugin must be an array.")
  }
  return {
    name: "prepend-directive",
    // At the end of the build step, directly prepend the specified directive to files with specified pattern

    writeBundle(_, bundle) {
      for (const [fileName, file] of Object.entries(bundle)) {
        if (file.type === "chunk") {
          for (const filePattern of filePatterns) {
            if (fileName.startsWith(filePattern)) {
              const filePath = `dist/${fileName}`
              const fileContent = readFileSync(filePath, "utf8")
              writeFileSync(filePath, `${directive};\n${fileContent}`)
              console.log(`Prepended ${directive} directive to ${filePath}`)
            }
          }
        }
      }
    },
  }
}
