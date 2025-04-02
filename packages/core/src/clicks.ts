import { defaultImpressionObserver } from './impressions'
import { DefaultLogger } from './logger'
import { PrivateMozAdsImpressionObserver } from './private/types'
import { MozAdsPlacementWithContent } from './types'

const logger = new DefaultLogger({ name: 'core.clicks' })

export async function recordClick(placement: MozAdsPlacementWithContent) {
  logger.info(`Click happened for: ${placement.placementId}`, {
    type: 'recordClick.clickOccurred',
    placementId: placement.placementId,
  })

  const privateImpressionObserver = defaultImpressionObserver as PrivateMozAdsImpressionObserver
  privateImpressionObserver.forceRecordImpression(placement)

  const clickUrl = placement.content?.callbacks?.click
  if (clickUrl) {
    try {
      await fetch(clickUrl, { keepalive: true })
    }
    catch (error: unknown) {
      logger.error(`Click callback failed for: ${placement.placementId} with an unknown error.`, {
        type: 'recordClick.callbackResponseError',
        eventLabel: 'fetch_error',
        path: clickUrl,
        placementId: placement.placementId,
        method: 'GET',
        errorId: (error as Error)?.name,
      })
    }
  }
  else {
    logger.error(`No click callback URL found for placement ID: ${placement.placementId}`, {
      type: 'recordClick.callbackNotFoundError',
      eventLabel: 'invalid_url_error',
      placementId: placement.placementId,
    })
  }
}
