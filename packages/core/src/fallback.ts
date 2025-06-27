import { AdResponse, ImageAd } from "@heyapi"
import { AdUnitFormatType, MozAdsPlacementConfig, MozAdsPlacements, MozAdsPlacementWithContent } from "./types"
import { FallbackAdURL, AdUnitFormatTypeLookup } from "./constants"
import { FALLBACK_BILLBOARD_SVG, FALLBACK_MRECTANGLE_SVG, FALLBACK_SKYSCRAPER_SVG } from "./images"

const fallbackAdContentLookup: Partial<Record<AdUnitFormatType, ImageAd>> = {
  Billboard: getFallbackBillboard(),
  Skyscraper: getFallbackSkyscraper(),
  MediumRectangle: getFallbackMediumRectangle(),
}

export function getFallbackAd(placement: MozAdsPlacementConfig | MozAdsPlacementWithContent): ImageAd {
  const fixedSize = placement?.fixedSize
  if (!fixedSize) {
    // If we don't have a fixedSize specified, there isn't a reliable way to decide what size backup ad to return, so we return nothing.
    // This should have the same behavior as if no ad was placed and the space on the page is given back.
    return {}
  }

  const adUnitFormatType = AdUnitFormatTypeLookup[`${fixedSize.width}x${fixedSize.height}`]
  return fallbackAdContentLookup[adUnitFormatType] ?? getFallbackSquareDefault()
}

export function getFallbackAds(placements: MozAdsPlacements): AdResponse {
  const reducer = (acc: AdResponse, placement: [string, MozAdsPlacementConfig | MozAdsPlacementWithContent]): AdResponse => {
    const placementName = placement[0]
    const placementWithContent = placement[1]

    const adContent = getFallbackAd(placementWithContent)

    return {
      ...acc,
      [placementName]: [adContent],
    }
  }

  return Object.entries(placements).reduce(reducer, {})
}

export function getFallbackBillboard(): ImageAd {
  return {
    url: FallbackAdURL["Billboard"],
    image_url: getSvgUri(FALLBACK_BILLBOARD_SVG),
  }
}

export function getFallbackSkyscraper(): ImageAd {
  return {
    url: FallbackAdURL["Skyscraper"],
    image_url: getSvgUri(FALLBACK_SKYSCRAPER_SVG),
  }
}

export function getFallbackMediumRectangle(): ImageAd {
  return {
    url: FallbackAdURL["MediumRectangle"],
    image_url: getSvgUri(FALLBACK_MRECTANGLE_SVG),
  }
}

export function getFallbackSquareDefault(): ImageAd {
  return {
    url: FallbackAdURL["MediumRectangle"],
    image_url: getSvgUri(FALLBACK_MRECTANGLE_SVG),
  }
}

function getSvgUri(svgSrc: string): string {
  const blob = new Blob([svgSrc], { type: "image/svg+xml" })
  return URL.createObjectURL(blob)
}

export function isFallback(placement: MozAdsPlacementWithContent): boolean {
  return placement.content?.image_url?.startsWith("blob:") ? true : false
}
