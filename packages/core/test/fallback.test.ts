import { mapResponseToPlacementsWithContent } from '@core/fetch'
import { IABFixedSize } from '../src/constants'
import { getFallbackAd, getFallbackAds, isFallback } from '../src/fallback'
import { MozAdsPlacements } from '../src/types'
import { MOCK_AD_PLACEMENTS } from './mocks/mockAdPlacements'
import { mockGetAdsResponse } from './mocks/mockGetAdsResponse'

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

  describe('isFallback helper', () => {
    test('correctly identifies placements with blob image urls as fallback ads', () => {
      const skyscraperConfig = {
        placementId: 'pocket_skyscraper_1',
        fixedSize: IABFixedSize.Skyscraper,
      }
      const skyscraperFallback = getFallbackAd(skyscraperConfig)
      const skyscraperPlacement = { ...skyscraperConfig, content: skyscraperFallback }
      const shouldBeAFallbackSkyscraper = isFallback(skyscraperPlacement)
      expect(shouldBeAFallbackSkyscraper).toBe(true)
    })

    test('correctly identifies when placements are not fallback ads', () => {
      const liveAds = mapResponseToPlacementsWithContent(mockGetAdsResponse, MOCK_AD_PLACEMENTS)
      for (const adKey in liveAds.keys) {
        expect(isFallback(liveAds[adKey])).toBe(false)
      }
    })
  })
})
