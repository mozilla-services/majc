import { AdResponse, ImageAd } from '@heyapi'
import { IABAdUnitFormatType, MozAdsPlacementConfig, MozAdsPlacements, MozAdsPlacementWithContent, MozAdsSize } from './types'
import { IABFixedSize } from './constants'
import { FALLBACK_BILLBOARD_SVG, FALLBACK_MRECTANGLE_SVG, FALLBACK_SKYSCRAPER_SVG } from './images'

function isAdFormat(format: IABAdUnitFormatType, size: MozAdsSize): boolean {
  return (size.height === IABFixedSize[format].height && size.width === IABFixedSize[format].width)
}

export function getFallbackAds(placements: MozAdsPlacements): AdResponse {
  const reducer = (acc: AdResponse, placement: [string, MozAdsPlacementConfig | MozAdsPlacementWithContent]): AdResponse => {
    const placementName = placement[0]
    const adSize = placement[1].fixedSize

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
    url: 'https://foundation.mozilla.org/?form=Donate_New_Tab&utm_source=newtab&utm_medium=firefox-desktop&utm_campaign=25-fund-nta&utm_content=Billboard-1940x500&utm_term=en',
    format: 'Billboard',
    image_url: getSvgUri(FALLBACK_BILLBOARD_SVG),
    alt_text: 'advertisement',
    callbacks: {
      click: '',
      report: '',
      impression: '',
    },
  }
}

export function getFallbackSkyscraper(): ImageAd {
  return {
    url: 'https://foundation.mozilla.org/?form=Donate_New_Tab&utm_source=newtab&utm_medium=firefox-desktop&utm_campaign=25-fund-nta&utm_content=Skyscraper-120x600&utm_term=en',
    format: 'Skyscraper',
    image_url: getSvgUri(FALLBACK_SKYSCRAPER_SVG),
    alt_text: 'advertisement',
    callbacks: {
      click: '',
      report: '',
      impression: '',
    },
  }
}

export function getFallbackMediumRectancle(): ImageAd {
  return {
    url: 'https://foundation.mozilla.org/?form=Donate_New_Tab&utm_source=newtab&utm_medium=firefox-desktop&utm_campaign=25-fund-nta&utm_content=MREC-300x250&utm_term=en',
    format: 'MediumRectangle',
    image_url: getSvgUri(FALLBACK_MRECTANGLE_SVG),
    alt_text: 'advertisement',
    callbacks: {
      click: '',
      report: '',
      impression: '',
    },
  }
}

export function getFallbackSquareDefault(): ImageAd {
  return {
    url: 'https://foundation.mozilla.org/?form=Donate_New_Tab&utm_source=newtab&utm_medium=firefox-desktop&utm_campaign=25-fund-nta&utm_content=MREC-300x250&utm_term=en',
    image_url: getSvgUri(FALLBACK_MRECTANGLE_SVG),
    alt_text: 'advertisement',
    callbacks: {
      click: '',
      report: '',
      impression: '',
    },
  }
}

function getSvgUri(svgSrc: string): string {
  const blob = new Blob([svgSrc], { type: 'image/svg+xml' })
  return URL.createObjectURL(blob)
}
