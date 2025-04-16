import { DEFAULT_SERVICE_ENDPOINT } from '../src/constants'

describe('core/constants.ts', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Use staging endpoint URLs when not in production', () => {
    expect(DEFAULT_SERVICE_ENDPOINT).toBe('https://ads.allizom.org/')
  })

  test('Use production endpoint URLs in production', () => {
    jest.isolateModules(() => {
      globalThis.process.env.NODE_ENV = 'production'
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const constants = require('../src/constants')
      expect(constants.DEFAULT_SERVICE_ENDPOINT).toBe('https://ads.mozilla.org/')
    })
  })
})
