import { ExpectedBuildOutput, MissingBuildFileError, MissingClientOnlyDirectiveError, validateBuildFiles } from '../validateBuild'
import fs, { PathOrFileDescriptor } from 'fs'

describe('scripts/validateBuild.ts', () => {
  const mockExpectedBuildOutput: ExpectedBuildOutput = {
    buildDir: 'exampleDist/',
    files: [
      'moduleA.js',
      'moduleA.mjs',
      'moduleB.js',
      'moduleB.mjs',
    ],
    clientOnlyModules: [
      'moduleA.js',
      'moduleA.mjs',
    ],
  }

  const readFileHappyPath = (path: PathOrFileDescriptor) => {
    if (path === 'exampleDist/moduleA.js') {
      return '"use client" console.log("HelloWorld");'
    }
    if (path === 'exampleDist/moduleA.mjs') {
      return '"use client" console.log("Hello World Again");'
    }
    return 'console.log("Hello")'
  }

  const readFileSadPath = (path: PathOrFileDescriptor) => {
    if (path === 'exampleDist/moduleA.js') {
      return '"use strict"; "use client"; console.log("HelloWorld");'
    }
    if (path === 'exampleDist/moduleA.mjs') {
      return '"use client" console.log("Hello World Again");'
    }
    return 'console.log("Hello")'
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('validateBuild succeeds with correct build files', () => {
    jest.spyOn(fs, 'readdirSync').mockReturnValueOnce([
      'moduleA.js',
      'moduleA.mjs',
      'moduleB.js',
      'moduleB.mjs',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any,
    )
    jest.spyOn(fs, 'readFileSync').mockImplementation(readFileHappyPath)
    validateBuildFiles(mockExpectedBuildOutput)
  })
  test('validateBuild fails with missing build files', () => {
    jest.spyOn(fs, 'readdirSync').mockReturnValueOnce([
      'moduleA.js',
      'moduleA.mjs',
      'moduleB.js',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any,
    )
    jest.spyOn(fs, 'readFileSync').mockImplementation(readFileHappyPath)
    expect(() => validateBuildFiles(mockExpectedBuildOutput)).toThrow()
  })
  test('validateBuild fails with missing build files', () => {
    jest.spyOn(fs, 'readdirSync').mockReturnValueOnce([
      'moduleA.js',
      'moduleA.mjs',
      'moduleB.js',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any,
    )
    jest.spyOn(fs, 'readFileSync').mockImplementation(readFileHappyPath)
    expect(() => validateBuildFiles(mockExpectedBuildOutput)).toThrow(MissingBuildFileError)
  })
  test('', () => {
    jest.spyOn(fs, 'readdirSync').mockReturnValueOnce([
      'moduleA.js',
      'moduleA.mjs',
      'moduleB.js',
      'moduleB.mjs',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any,
    )
    jest.spyOn(fs, 'readFileSync').mockImplementation(readFileSadPath)
    expect(() => validateBuildFiles(mockExpectedBuildOutput)).toThrow(MissingClientOnlyDirectiveError)
  })
})
