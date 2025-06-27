import {
  AdUnitFormatTypeLookup,
  AdUnitFormatImpressionThreshold,
  DefaultImpressionThreshold,
} from "./constants"
import { isFallback } from "./fallback"
import { DefaultLogger } from "./logger"
import { MozAdsPlacementWithContent } from "./types"

const logger = new DefaultLogger({ name: "core.impressions" })

export type MozAdsImpressionTracker = Record<string, PlacementImpressionInfo>

export interface PlacementImpressionInfo {
  viewStatus: "unseen" | "in-view" | "viewed"
  viewThreshold: number
  timeThreshold: number
  impressionUrl?: string | null
  timeout?: ReturnType<typeof setTimeout>
}

export interface MozAdsImpressionObserver {
  impressionTracker: MozAdsImpressionTracker

  observe: (placement: MozAdsPlacementWithContent) => void
  unobserve: (placementId: string) => void
}

export class DefaultMozAdsImpressionObserver implements MozAdsImpressionObserver {
  public intersectionObserver?: IntersectionObserver
  public impressionTracker: MozAdsImpressionTracker

  constructor() {
    this.impressionTracker = {}

    if (!globalThis.IntersectionObserver) {
      // logger.warn('IntersectionObserver not found in the global namespace; Impressions may not be observed or this message is being shown server-side.')
      return
    }

    this.intersectionObserver = new globalThis.IntersectionObserver(
      this.intersectionCallback,
      { threshold: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] },
    )
  }

  private async recordImpression(placementId: string, impressionUrl?: string | null) {
    if (!impressionUrl || !URL.canParse(impressionUrl)) {
      logger.error(`Invalid impression URL for placement: ${placementId}`, {
        type: "impressionObserver.recordImpression.invalidCallbackError",
        eventLabel: "invalid_url_error",
        path: impressionUrl || "null or undefined",
      })
      return
    }
    logger.info(`Impression occurred for placement: ${placementId}`, {
      type: "impressionObserver.recordImpression.viewed",
      placementId: placementId,
    })
    try {
      const response = await fetch(impressionUrl, { keepalive: true })
      if (!response.ok) {
        logger.error(`Impression callback returned a non-200 for placement: ${placementId}`, {
          type: "impressionObserver.recordImpression.callbackResponseError",
          eventLabel: "fetch_error",
          path: impressionUrl,
          placementId: placementId,
          method: "GET",
          errorId: `${response.status}`,
        })
      }
    }
    catch (error: unknown) {
      logger.error(`Impression callback threw an unexpected error for placement: ${placementId}`, {
        type: "impressionObserver.recordImpression.callbackResponseError",
        eventLabel: "fetch_error",
        path: impressionUrl,
        placementId: placementId,
        method: "GET",
        errorId: (error as Error)?.name,
      })
    }
  }

  public forceRecordImpression(placement: MozAdsPlacementWithContent) {
    const placementId = placement.placementId
    const trackedPlacement = this.impressionTracker[placementId]
    if (!trackedPlacement) {
      this.recordImpression(placementId, placement.content?.callbacks?.impression)
      return
    }

    if (trackedPlacement.viewStatus !== "viewed") {
      clearTimeout(trackedPlacement.timeout)
      trackedPlacement.timeout = undefined

      this.recordImpression(placementId, trackedPlacement.impressionUrl)
      trackedPlacement.viewStatus = "viewed"
      this.unobserve(placementId)
    }
  }

  public observe(placement: MozAdsPlacementWithContent) {
    // No need to observe fallback ads -- they are meant for an offline experience so they don't
    // have dynamic impression urls from MARS, so we can't register an impression for them.
    if (isFallback(placement)) return
    const placementId = placement.placementId
    const placementImage = document.querySelector<HTMLImageElement>(`.moz-ads-placement-img[data-placement-id="${placementId}"]`)
    if (!placementImage) {
      logger.warn(`Could not find element with ID: ${placementId} while attempting to observe ad`, {
        type: "impressionObserver.observeAd.adNotFoundError",
        placementId: placementId,
      })
      return
    }

    const adUnitFormatType = AdUnitFormatTypeLookup[`${placementImage.width}x${placementImage.height}`]
    const threshold = AdUnitFormatImpressionThreshold[adUnitFormatType]
    this.impressionTracker[placementId] = {
      viewStatus: "unseen",
      viewThreshold: threshold?.percent ?? DefaultImpressionThreshold.percent,
      timeThreshold: threshold?.duration ?? DefaultImpressionThreshold.duration,
      impressionUrl: placement.content?.callbacks?.impression,
    }

    this.intersectionObserver?.observe(placementImage)
  }

  public unobserve(placementId: string) {
    const placementImage = document.querySelector<HTMLImageElement>(`.moz-ads-placement-img[data-placement-id="${placementId}"]`)
    if (placementImage) {
      this.intersectionObserver?.unobserve(placementImage)
    }
  }

  private observeAgainLater(placementId: string, delay: number) {
    const recordImpressionIfInView = () => {
      if (this.impressionTracker[placementId].viewStatus === "in-view") {
        this.recordImpression(placementId, this.impressionTracker[placementId].impressionUrl)
        this.impressionTracker[placementId].viewStatus = "viewed"
        this.impressionTracker[placementId].timeout = undefined
        this.unobserve(placementId)
      }
    }

    const timeout = setTimeout(recordImpressionIfInView, delay)
    this.impressionTracker[placementId].timeout = timeout
  }

  private intersectionCallback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(async (entry) => {
      const placementId = (entry.target as HTMLElement).dataset.placementId
      if (!placementId) {
        return
      }
      const placementImpressionInfo = this.impressionTracker[placementId]
      if (!placementImpressionInfo) {
        return
      }

      const intersectionRatio = entry.intersectionRatio

      if (intersectionRatio >= placementImpressionInfo.viewThreshold) {
        if (this.impressionTracker[placementId].viewStatus !== "in-view") {
          this.impressionTracker[placementId].viewStatus = "in-view"
          this.observeAgainLater(placementId, this.impressionTracker[placementId].timeThreshold)
        }
      }
      else {
        this.impressionTracker[placementId].viewStatus = "unseen"
        clearTimeout(this.impressionTracker[placementId].timeout)
        this.impressionTracker[placementId].timeout = undefined
      }
    })
  }
}

export const defaultImpressionObserver = new DefaultMozAdsImpressionObserver()
