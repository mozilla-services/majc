'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { fetchAds } from '@core/fetch'
import { DefaultLogger } from '@core/logger'
import { MozAdsPlacementConfig, MozAdsPlacements, MozAdsPlacementWithContent } from '@core/types'

let logger: DefaultLogger

try {
  logger = new DefaultLogger({ name: 'react.hooks.useMozAdsPlacement' })
}
catch (error: unknown) {
  console.debug(`DefaultLogger for react.hooks.useMozAdsPlacement could not be instantiated: ${error}`)
}

export class MozAdsPlacementContextState {
  placements: MozAdsPlacements = {}

  async getPlacementWithContent(placement: MozAdsPlacementConfig): Promise<MozAdsPlacementWithContent> {
    const cachedPlacementWithContent = this.placements[placement.placementId]
    if (cachedPlacementWithContent) {
      return cachedPlacementWithContent
    }

    try {
      const placementsWithContent = await fetchAds({
        placements: {
          [placement.placementId]: placement,
        },
      })

      this.placements = {
        ...this.placements,
        ...placementsWithContent,
      }
    }
    catch (error: unknown) {
      logger?.error(`Unable to fetch ads; ${(error as Error).message}`, {
        type: 'placementComponent.adLoad.failure',
        eventLabel: 'ad_load_error',
        errorId: (error as Error)?.name,
      })
      placement.onError?.({
        error: error as Error,
      })
      return placement
    }

    return this.placements[placement.placementId]
  }
}

export const mozAdsPlacementContext = createContext<MozAdsPlacementContextState>(new MozAdsPlacementContextState())

export const useMozAdsPlacement = ({
  placementId,
  iabContentCategoryIds,
  fixedSize,

  onError,
}: MozAdsPlacementConfig): MozAdsPlacementWithContent => {
  const [placement, setPlacement] = useState<MozAdsPlacementWithContent>({ placementId, iabContentCategoryIds, fixedSize })

  const context = useContext(mozAdsPlacementContext)

  const getData = async () => {
    setPlacement(await context.getPlacementWithContent({
      placementId,
      iabContentCategoryIds,
      fixedSize,

      onError,
    }))
  }

  useEffect(() => {
    getData()
  }, [placementId])

  return placement
}
