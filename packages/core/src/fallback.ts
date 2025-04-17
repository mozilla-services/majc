import { AdResponse, ImageAd } from '@heyapi'
import { AdUnitFormatType, MozAdsPlacementConfig, MozAdsPlacements, MozAdsPlacementWithContent } from './types'
import { FallbackAdURL, AdUnitFormatTypeLookup } from './constants'
import { FALLBACK_BILLBOARD_SVG, FALLBACK_MRECTANGLE_SVG, FALLBACK_SKYSCRAPER_SVG } from './images'

export const fallbackAdContentLookup: Partial<Record<AdUnitFormatType, ImageAd>> = {
  Billboard: getFallbackBillboard(),
  Skyscraper: getFallbackSkyscraper(),
  MediumRectangle: getFallbackMediumRectangle(),
}

export function getFallbackAds(placements: MozAdsPlacements): AdResponse {
  const reducer = (acc: AdResponse, placement: [string, MozAdsPlacementConfig | MozAdsPlacementWithContent]): AdResponse => {
    const placementName = placement[0]
    const fixedSize = placement[1]?.fixedSize
    if (!fixedSize) {
      // If we don't have a fixedSize specified, there isn't a reliable way to decide what size backup ad to return, so we return nothing.
      // This should have the same behavior as if no ad was placed and the space on the page is given back.
      return {
        ...acc,
        [placementName]: [{}],
      }
    }

    const adUnitFormatType = AdUnitFormatTypeLookup[`${fixedSize.width}x${fixedSize.height}`]
    return {
      ...acc,
      [placementName]: [fallbackAdContentLookup[adUnitFormatType] ?? getFallbackSquareDefault()],
    }
  }

  return Object.entries(placements).reduce(reducer, {})
}

export function getFallbackBillboard(): ImageAd {
  return {
    url: FallbackAdURL['Billboard'],
    format: 'Billboard',
    image_url: getSvgUri(FALLBACK_BILLBOARD_SVG),
  }
}

export function getFallbackSkyscraper(): ImageAd {
  return {
    url: FallbackAdURL['Skyscraper'],
    format: 'Skyscraper',
    image_url: getSvgUri(FALLBACK_SKYSCRAPER_SVG),
  }
}

export function getFallbackMediumRectangle(): ImageAd {
  return {
    url: FallbackAdURL['MediumRectangle'],
    format: 'MediumRectangle',
    image_url: getSvgUri(FALLBACK_MRECTANGLE_SVG),
  }
}

export function getFallbackSquareDefault(): ImageAd {
  return {
    url: FallbackAdURL['MediumRectangle'],
    image_url: getSvgUri(FALLBACK_MRECTANGLE_SVG),
  }
}

function getSvgUri(svgSrc: string): string {
  const blob = new Blob([svgSrc], { type: 'image/svg+xml' })
  return URL.createObjectURL(blob)
}
