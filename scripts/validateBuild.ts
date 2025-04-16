import { readFileSync, readdirSync } from 'fs'
import packageJson from '../../package.json'

export interface ExpectedBuildOutput {
  buildDir: string
  files: string[]
  clientOnlyModules: string[]
}

function validateClientOnlyBuildFile(filePath: string) {
  const fileContent = readFileSync(filePath, 'utf8')
  if (!fileContent.startsWith('"use client"')) {
    throw Error(`"Client-only" build module ${filePath} does not start with "use client" directive.`)
  }
}

export function validateBuildFiles(expectedBuildOutput: ExpectedBuildOutput) {
  const files = readdirSync(expectedBuildOutput.buildDir)
  const filesSet = new Set()
  for (const file of files) {
    filesSet.add(file)
    if (expectedBuildOutput.clientOnlyModules.includes(file)) {
      validateClientOnlyBuildFile(`${expectedBuildOutput.buildDir}${file}`)
    }
  }
  for (const requiredFile of expectedBuildOutput.files) {
    if (!filesSet.has(requiredFile)) {
      throw Error(`Expected module ${requiredFile} not found in build directory ${expectedBuildOutput.buildDir}`)
    }
  }
}

export function validatePackageExports(expectedBuildOutput: ExpectedBuildOutput) {
  if (!packageJson.files.includes(expectedBuildOutput.buildDir)) {
    throw Error(`package.json does not included the expected build output directory: ${expectedBuildOutput.buildDir} in "files"`)
  }
}
