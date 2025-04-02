import {
  DEFAULT_IMPRESSION_VIEW_THRESHOLD,
  DEFAULT_IMPRESSION_TIME_THRESHOLD_MS,
  FALLBACK_IMPRESSION_VIEW_THRESHOLD,
  FALLBACK_IMPRESSION_TIME_THRESHOLD,
  FALLBACK_IMPRESSION_ENDPOINT,
} from './constants'
import { DefaultLogger } from './logger'
import { MozAdsPlacementWithContent } from './types'

const logger = new DefaultLogger({ name: 'core.impressions' })

export type MozAdsImpressionTracker = Record<string, PlacementImpressionInfo>

export interface PlacementImpressionInfo {
  viewStatus: 'unseen' | 'in-view' | 'viewed'
  viewThreshold: number
  timeThreshold: number
  impressionUrl: string
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
    if (impressionUrl) {
      logger.info(`Impression occurred for placement: ${placementId}`, {
        type: 'impressionObserver.recordImpression.viewed',
        placementId: placementId,
      })
      try {
        const response = await fetch(impressionUrl, { keepalive: true })
        if (!response.ok) {
          logger.error(`Impression callback returned a non-200 for placement: ${placementId}`, {
            type: 'impressionObserver.recordImpression.callbackResponseError',
            eventLabel: 'fetch_error',
            path: impressionUrl,
            placementId: placementId,
            method: 'GET',
            errorId: `${response.status}`,
          })
        }
      }
      catch (error: unknown) {
        logger.error(`Impression callback threw an unexpected error for placement: ${placementId}`, {
          type: 'impressionObserver.recordImpression.callbackResponseError',
          eventLabel: 'fetch_error',
          path: impressionUrl,
          placementId: placementId,
          method: 'GET',
          errorId: (error as Error)?.name,
        })
      }
    }
    else {
      logger.error(`No impression callback URL found for placement: ${placementId}`, {
        type: 'impressionObserver.recordImpression.callbackNotFoundError',
        eventLabel: 'invalid_url_error',
        placementId: placementId,
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

    if (trackedPlacement.viewStatus !== 'viewed') {
      clearTimeout(trackedPlacement.timeout)
      trackedPlacement.timeout = undefined

      this.recordImpression(placementId, trackedPlacement.impressionUrl)
      trackedPlacement.viewStatus = 'viewed'
      this.unobserve(placementId)
    }
  }

  public observe(placement: MozAdsPlacementWithContent) {
    const placementId = placement.placementId
    this.impressionTracker[placementId] = {
      viewStatus: 'unseen',
      viewThreshold: DEFAULT_IMPRESSION_VIEW_THRESHOLD[placementId] ?? FALLBACK_IMPRESSION_VIEW_THRESHOLD,
      timeThreshold: DEFAULT_IMPRESSION_TIME_THRESHOLD_MS[placementId] ?? FALLBACK_IMPRESSION_TIME_THRESHOLD,
      impressionUrl: placement.content?.callbacks?.impression ?? FALLBACK_IMPRESSION_ENDPOINT,
    }
    const placementElement = document.querySelector(`.moz-ads-placement-img[data-placement-id="${placementId}"]`)
    if (!placementElement) {
      logger.warn(`Could not find element with ID: ${placementId} while attempting to observe ad`, {
        type: 'impressionObserver.observeAd.adNotFoundError',
        placementId: placementId,
      })
      return
    }
    this.intersectionObserver?.observe(placementElement)
  }

  public unobserve(placementId: string) {
    const placementElement = document.querySelector(`.moz-ads-placement-img[data-placement-id="${placementId}"]`)
    if (placementElement) {
      this.intersectionObserver?.unobserve(placementElement)
    }
  }

  private observeAgainLater(placementId: string, delay: number) {
    const recordImpressionIfInView = () => {
      if (this.impressionTracker[placementId].viewStatus === 'in-view') {
        this.recordImpression(placementId, this.impressionTracker[placementId].impressionUrl)
        this.impressionTracker[placementId].viewStatus = 'viewed'
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
        if (this.impressionTracker[placementId].viewStatus !== 'in-view') {
          this.impressionTracker[placementId].viewStatus = 'in-view'
          this.observeAgainLater(placementId, this.impressionTracker[placementId].timeThreshold)
        }
      }
      else {
        this.impressionTracker[placementId].viewStatus = 'unseen'
        clearTimeout(this.impressionTracker[placementId].timeout)
        this.impressionTracker[placementId].timeout = undefined
      }
    })
  }
}

export const defaultImpressionObserver = new DefaultMozAdsImpressionObserver()
