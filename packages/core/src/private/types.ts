import { MozAdsImpressionObserver } from '../impressions'
import { MozAdsPlacementWithContent } from '../types'

export interface PrivateMozAdsImpressionObserver extends MozAdsImpressionObserver {
  forceRecordImpression: (placement: MozAdsPlacementWithContent) => void
}
