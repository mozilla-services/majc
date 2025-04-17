import { IABFixedSize } from '../src/constants'
import { getFallbackAds } from '../src/fallback'
import { MozAdsPlacements } from '../src/types'

describe('core/store.ts', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('fallback returns correct ads', () => {
    const testPlacements: MozAdsPlacements = {
      pocket_billboard_1:
      {
        placementId: 'pocket_billboard_1',
        fixedSize: IABFixedSize.Billboard,
      },
      pocket_billboard_2:
      {
        placementId: 'pocket_billboard_2',
        fixedSize: IABFixedSize.Billboard,
      },
      pocket_skyscraper_1:
      {
        placementId: 'pocket_skyscraper_1',
        fixedSize: IABFixedSize.Skyscraper,
      },
      pocket_medium_rectangle_1: {
        placementId: 'pocket_medium_rectangle_1',
        fixedSize: IABFixedSize.MediumRectangle,
      },
      pocket_unknown_1: {
        placementId: 'pocket_unknown_1',
      },
      pocket_unhandled_size_1: {
        placementId: 'pocket_unhandled_size_1',
        fixedSize: IABFixedSize.TwentyBySixty,
      },
    }

    const fallbacks = getFallbackAds(testPlacements)

    expect(fallbacks['pocket_billboard_1']).toHaveLength(1)
    expect(fallbacks['pocket_billboard_2']).toHaveLength(1)
    expect(fallbacks['pocket_skyscraper_1']).toHaveLength(1)
    expect(fallbacks['pocket_medium_rectangle_1']).toHaveLength(1)
    expect(fallbacks['pocket_unknown_1']).toHaveLength(1)
    expect(fallbacks['pocket_unhandled_size_1']).toHaveLength(1)

    expect(fallbacks['pocket_billboard_1'][0].format).toBeUndefined()
    expect(fallbacks['pocket_billboard_2'][0].format).toBeUndefined()
    expect(fallbacks['pocket_skyscraper_1'][0].format).toBeUndefined()
    expect(fallbacks['pocket_medium_rectangle_1'][0].format).toBeUndefined()
    expect(fallbacks['pocket_unknown_1'][0].format).toBeUndefined()
    expect(fallbacks['pocket_unhandled_size_1'][0].format).toBeUndefined()
  })
})
