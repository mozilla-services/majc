import { defaultImpressionObserver } from "./impressions"
import { isFallback } from "./fallback"
import { DefaultLogger } from "./logger"
import { PrivateMozAdsImpressionObserver } from "./private/types"
import { MozAdsPlacementWithContent } from "./types"

const logger = new DefaultLogger({ name: "core.clicks" })

export async function recordClick(placement: MozAdsPlacementWithContent) {
  // No need to send click events for fallback ads -- they are meant for an offline experience so
  // they don't have dynamic click urls from MARS, so we can't register a click for them.
  if (isFallback(placement)) return

  const clickUrl = placement.content?.callbacks?.click
  if (!clickUrl || !URL.canParse(clickUrl)) {
    logger.error(`Invalid click URL for placement: ${placement.placementId}`, {
      type: "recordClick.invalidCallbackError",
      eventLabel: "invalid_url_error",
      path: clickUrl || "null or undefined",
      placementId: placement.placementId,
    })
    return
  }
  logger.info(`Click happened for: ${placement.placementId}`, {
    type: "recordClick.clickOccurred",
    placementId: placement.placementId,
  })

  const privateImpressionObserver = defaultImpressionObserver as PrivateMozAdsImpressionObserver
  privateImpressionObserver.forceRecordImpression(placement)

  try {
    await fetch(clickUrl, { keepalive: true })
  }
  catch (error: unknown) {
    logger.error(`Click callback failed for: ${placement.placementId}.`, {
      type: "recordClick.callbackResponseError",
      eventLabel: "fetch_error",
      path: clickUrl,
      placementId: placement.placementId,
      method: "GET",
      errorId: (error as Error)?.name || "Unknown",
    })
  }
}
