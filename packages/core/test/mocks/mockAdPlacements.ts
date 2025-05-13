import { IABFixedSize, FallbackAdURL } from '@core/constants'
import { MozAdsPlacements } from '../../src/types'

export const MOCK_AD_PLACEMENTS: MozAdsPlacements = {
  pocket_billboard_1: {
    placementId: 'pocket_billboard_1',
    content: {
      format: 'billboard',
      url: 'https://www.mozilla.org/en-US/advertising/billoard1',
      callbacks: {
        click: 'https://fake_click_url.abc/1',
        impression: 'https://fake_impression_url.abc/1',
      },
      image_url: 'https://picsum.photos/970/250?random=1',
      // alt_text: 'Ad 1 for mozilla_ads',
      block_key: 'CAQSC21vemlsbGFfYWRz',
    },
  },
  pocket_billboard_2: {
    placementId: 'pocket_billboard_2',
    content: {
      format: 'billboard',
      url: 'https://www.mozilla.org/en-US/advertising/billoard2',
      callbacks: {
        click: 'https://fake_click_url.abc/2',
        impression: 'https://fake_impression_url.abc/2',
      },
      image_url: 'https://picsum.photos/970/250?random=2',
      // alt_text: 'Ad 1 for mozilla_ads',
      block_key: 'CAQSC21vemlsbGFfYWRz',
    },
  },
  invalid_placement_1: {
    placementId: 'invalid_placement_1',
  },
  fallback_placement_1: {
    placementId: 'fallback_placement_1',
    fixedSize: IABFixedSize.Skyscraper,
    content: {
      format: 'skyscraper',
      url: FallbackAdURL['Skyscraper'],
      image_url: 'blob://blobbish',
    },
  },
}
