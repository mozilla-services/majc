import { ExpectedBuildOutput } from '../validateBuild'

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
      'moduleB.js',
      'moduleB.mjs',
    ],
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('', () => {
    fail()
  })
})
