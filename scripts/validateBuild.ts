import { readFileSync, readdirSync } from 'fs'

export interface ExpectedBuildOutput {
  buildDir: string
  files: string[]
  clientOnlyModules: string[]
}

export class MissingBuildFileError extends Error {
  override name = 'MissingBuildFileError'
  constructor(
    public cause: Error,
  ) {
    super(cause.message, { cause })
  }
}

export class MissingClientOnlyDirectiveError extends Error {
  override name = 'MissingClientOnlyDirectiveError'
  constructor(
    public cause: Error,
  ) {
    super(cause.message, { cause })
  }
}

function validateClientOnlyBuildFile(filePath: string) {
  const fileContent = readFileSync(filePath, 'utf8')
  if (!fileContent.startsWith('"use client";')) {
    throw new MissingClientOnlyDirectiveError(Error(`"Client-only" build module ${filePath} does not start with "use client" directive.`))
  }
}

export function validateBuildFiles(expectedBuildOutput: ExpectedBuildOutput) {
  const filesInBuildDir = readdirSync(expectedBuildOutput.buildDir)
  const filesInBuildDirSet = new Set()
  for (const file of filesInBuildDir) {
    filesInBuildDirSet.add(file)
    if (expectedBuildOutput.clientOnlyModules.includes(file)) {
      validateClientOnlyBuildFile(`${expectedBuildOutput.buildDir}${file}`)
    }
  }
  for (const requiredFile of expectedBuildOutput.files) {
    if (!filesInBuildDirSet.has(requiredFile)) {
      throw new MissingBuildFileError(Error(`Expected module ${requiredFile} not found in build directory ${expectedBuildOutput.buildDir}`))
    }
  }
}
