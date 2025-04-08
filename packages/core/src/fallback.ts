import { AdResponse, ImageAd } from '@heyapi'
import { IABAdUnitFormatType, MozAdsPlacementConfig, MozAdsPlacements, MozAdsPlacementWithContent } from './types'
import { FallbackAdURL, IABFixedSizeLookup } from './constants'
import { FALLBACK_BILLBOARD_SVG, FALLBACK_MRECTANGLE_SVG, FALLBACK_SKYSCRAPER_SVG } from './images'

const fallbackAdContentLookup: Partial<Record<IABAdUnitFormatType, ImageAd>> = {
  Billboard: getFallbackBillboard(),
  Skyscraper: getFallbackSkyscraper(),
  MediumRectangle: getFallbackMediumRectangle(),
}

export function getFallbackAds(placements: MozAdsPlacements): AdResponse {
  const reducer = (acc: AdResponse, placement: [string, MozAdsPlacementConfig | MozAdsPlacementWithContent]): AdResponse => {
    const placementName = placement[0]
    const adSize = placement[1]?.fixedSize

    if (!adSize) {
      // If we don't have an adSize specificed, there isn't a reliable way to decide what size backup ad to return... so we return nothing.
      // This should have the same behavior as if no ad was placed and the space on the page is given back
      return {
        ...acc,
        [placementName]: [{}],
      }
    }

    const adType = IABFixedSizeLookup[adSize.width]?.[adSize.height]

    return {
      ...acc,
      [placementName]: [fallbackAdContentLookup[adType] ?? getFallbackSquareDefault()],
    }
  }
  const fallbackAdResponse: AdResponse = Object.entries(placements).reduce(reducer, {})

  return fallbackAdResponse
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
