import { defaultImpressionObserver } from './impressions'
import { isFallback } from './fallback'
import { DefaultLogger } from './logger'
import { PrivateMozAdsImpressionObserver } from './private/types'
import { MozAdsPlacementWithContent } from './types'

const logger = new DefaultLogger({ name: 'core.clicks' })

export async function recordClick(placement: MozAdsPlacementWithContent) {
  // No need to send click events for fallback ads -- they are meant for an offline experience so
  // they don't have dynamic click urls from MARS, so we can't register a click for them.
  if (isFallback(placement)) return
  console.log('recordClick: not a fallback: ', placement)

  const clickUrl = placement.content?.callbacks?.click
  if (!clickUrl || !URL.canParse(clickUrl)) {
    console.log('recordClick: gonna log invalid click ur')

    logger.error(`Invalid click URL for placement: ${placement.placementId}`, {
      type: 'recordClick.invalidCallbackError',
      eventLabel: 'invalid_url_error',
      placementId: placement.placementId,
    })
    return
  }
  console.log('gonna log click happened')
  logger.info(`Click happened for: ${placement.placementId}`, {
    type: 'recordClick.clickOccurred',
    placementId: placement.placementId,
  })

  const privateImpressionObserver = defaultImpressionObserver as PrivateMozAdsImpressionObserver
  privateImpressionObserver.forceRecordImpression(placement)

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
