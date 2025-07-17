/* eslint-disable react-hooks/rules-of-hooks */

import { useLayoutEffect, useRef } from "react"
import { recordClick } from "@core/clicks"
import { renderPlacement } from "@core/display"
import { defaultImpressionObserver } from "@core/impressions"
import { DefaultLogger } from "@core/logger"
import {
  MozAdsPlacementConfig,
  MozAdsRenderPlacementErrorEvent,
  MozAdsRenderPlacementEvent,
  MozAdsRenderPlacementReportEvent,
} from "@core/types"
import { useMozAdsPlacement } from "../hooks/useMozAdsPlacement"
import { getFallbackAd } from "@core/fallback"

let logger: DefaultLogger

try {
  logger = new DefaultLogger({ name: "react.components.MozAdsPlacement" })
}
catch (error: unknown) {
  console.debug(`DefaultLogger for react.components.MozAdsPlacement could not be instantiated: ${error}`)
}

export function MozAdsPlacement({
  placementId,
  iabContent,
  fixedSize,

  onClick,
  onReport,
  onError,
  onLoad,
}: MozAdsPlacementConfig) {
  const { width, height } = fixedSize || {}
  const style = {
    width: width && `${width}px`,
    height: height && `${height}px`,
  }

  try {
    const placement = useMozAdsPlacement({
      placementId,
      iabContent,
      fixedSize,

      onError,
    })

    const containerRef = useRef<HTMLDivElement>(null)

    const callbacks = {
      onClick: (event: MozAdsRenderPlacementEvent) => {
        recordClick(placement)
        onClick?.(event)
      },
      onReport: (event: MozAdsRenderPlacementReportEvent) => {
        onReport?.(event)
      },
      onError: (event: MozAdsRenderPlacementErrorEvent) => {
        onError?.(event)
      },
      onLoad: (event: MozAdsRenderPlacementEvent) => {
        defaultImpressionObserver.observe(placement)
        onLoad?.(event)
      },
    }

    useLayoutEffect(() => {
      if (containerRef.current) {
        renderPlacement(containerRef.current, {
          placement,
          ...callbacks,
          onError: () => {
            // if an render error occurs, we try and render a fallback instead
            const fallback = getFallbackAd(placement)
            if (containerRef.current) {
              renderPlacement(containerRef.current, {
                placement: {
                  ...placement,
                  content: fallback,
                },
                ...callbacks,
              },

              )
            }
          },
        })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [placement])

    return (
      <div ref={containerRef} style={style} />
    )
  }
  catch (error: unknown) {
    try {
      logger?.error(`An unexpected error has occured when rendering ${placementId}: ${(error as Error)?.message}`, {
        type: "placementComponent.render.error",
        eventLabel: "render_error",
        placementId: placementId,
        errorId: (error as Error)?.name,
      })
      onError?.({
        error: error as Error,
      })
    }
    catch {
      // Do nothing if the logger somehow throws an error
    }

    return (
      <div style={style} />
    )
  }
}
