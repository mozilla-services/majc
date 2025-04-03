import { AdResponse, ImageAd } from '@heyapi'
import { IABAdUnitFormatType, MozAdsPlacementConfig, MozAdsPlacements, MozAdsPlacementWithContent, MozAdsSize } from './types'
import { FallbackAdURL, IABFixedSize } from './constants'
import { FALLBACK_BILLBOARD_SVG, FALLBACK_MRECTANGLE_SVG, FALLBACK_SKYSCRAPER_SVG } from './images'

function isAdFormat(format: IABAdUnitFormatType, size: MozAdsSize): boolean {
  return (size.height === IABFixedSize[format].height && size.width === IABFixedSize[format].width)
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

    switch (true) {
      case isAdFormat('Billboard', adSize):
        return {
          ...acc,
          [placementName]: [getFallbackBillboard()],
        }

      case isAdFormat('Skyscraper', adSize):
        return {
          ...acc,
          [placementName]: [getFallbackSkyscraper()],
        }

      case isAdFormat('MediumRectangle', adSize):
        return {
          ...acc,
          [placementName]: [getFallbackMediumRectancle()],
        }

      default:
        return {
          ...acc,
          [placementName]: [getFallbackSquareDefault()],
        }
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

export function getFallbackMediumRectancle(): ImageAd {
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
