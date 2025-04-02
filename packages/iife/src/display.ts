import { recordClick } from '@core/clicks'
import { renderPlacement as renderPlacementCore } from '@core/display'
import { fetchAds } from '@core/fetch'
import { defaultImpressionObserver } from '@core/impressions'
import { DefaultLogger } from '@core/logger'
import { MozAdsPlacementConfig } from '@core/types'

const logger = new DefaultLogger({ name: 'iife.display' })

export async function renderPlacement(elementOrId: HTMLElement | string, placement: MozAdsPlacementConfig) {
  const element = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId
  if (!element) {
    if (typeof elementOrId === 'string') {
      logger.error(`Unable to render placement; No element found with ID ${elementOrId}`)
    }
    else {
      logger.error('Unable to render placement; Invalid element')
    }
    return
  }

  renderPlacementCore(element, { placement })

  try {
    await fetchAds({
      placements: {
        [placement.placementId]: placement,
      },
    })

    renderPlacementCore(element, {
      placement,

      onLoad: () => {
        defaultImpressionObserver.observe(placement)
      },
      onClick: () => {
        recordClick(placement)
      },
    })
  }
  catch (error: unknown) {
    logger.error(`Unable to fetch ads; ${(error as Error).message}`)
  }
}
