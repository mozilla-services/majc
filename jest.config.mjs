/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  collectCoverage: true,
  collectCoverageFrom: [
    'packages/core/src/**/*.{js,jsx,ts,tsx}',
    'packages/iife/src/**/*.{js,jsx,ts,tsx}',
    'packages/react/src/**/*.{js,jsx,ts,tsx}',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'text-summary'],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.ts',
  ],
  testEnvironment: 'jsdom',
  transform: {
    '^.+.(ts|tsx)?$': ['ts-jest', {}],
  },
  moduleNameMapper: {
    '@/jest.setup': ['<rootDir>/jest.setup.ts'],
    '@/package.json': ['<rootDir>/package.json'],
    '@core/.*': ['<rootDir>/packages/core/src/$1'],
    '@heyapi': ['<rootDir>/packages/heyapi/src/index'],
    '@iife/.*': ['<rootDir>/packages/iife/src/$1'],
    '@react/.*': ['<rootDir>/packages/react/src/$1'],
  },
}
