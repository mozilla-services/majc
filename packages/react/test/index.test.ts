import { FixedSize } from '@core/constants'
import * as index from '../src/index'

describe('react/index.ts', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('@core/index exports are also exported in react/index', () => {
    expect(index.FixedSize).toEqual(FixedSize)
  })

  test('MozAdsPlacement is exported in react/index', () => {
    expect(index.MozAdsPlacement).toBeInstanceOf(Function)
  })

  test('useMozAdsPlacement is exported in react/index', () => {
    expect(index.useMozAdsPlacement).toBeInstanceOf(Function)
  })
})
