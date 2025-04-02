import { AdResponse, ImageAd } from '@heyapi'
import { IABAdUnitFormatType, MozAdsPlacementConfig, MozAdsPlacements, MozAdsPlacementWithContent, MozAdsSize } from './types'
import { IABFixedSize } from './constants'

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
    url: 'https://foundation.mozilla.org/en/',
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
    url: 'https://foundation.mozilla.org/en/',
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
    url: 'https://foundation.mozilla.org/en/',
    format: 'MediumRectangle',
    image_url: getSvgUri(FALLBACK_MED_RECTANGLE_SVG),
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
    url: 'https://foundation.mozilla.org/en/',
    image_url: getSvgUri(FALLBACK_SQUARE_DEFAULT_SVG),
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

const FALLBACK_BILLBOARD_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <!-- Background -->
    <rect width="200" height="200" fill="#f0f0f0" />

    <!-- Monitor Frame -->
    <rect x="30" y="30" width="140" height="80" rx="10" ry="10" fill="black" />
    <rect x="35" y="35" width="130" height="70" rx="5" ry="5" fill="white" />
    
    <!-- Monitor Screen -->
    <rect x="45" y="45" width="110" height="50" fill="#dcdcdc" />

    <!-- Code Blocks (simulating code) -->
    <rect x="50" y="50" width="30" height="8" fill="#4caf50" />
    <rect x="50" y="60" width="50" height="8" fill="#2196f3" />
    <rect x="50" y="70" width="40" height="8" fill="#ff9800" />
  </svg>`

const FALLBACK_SKYSCRAPER_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <!-- Background -->
    <rect width="200" height="200" fill="#f0f0f0" />

    <!-- Monitor Frame -->
    <rect x="30" y="30" width="140" height="80" rx="10" ry="10" fill="black" />
    <rect x="35" y="35" width="130" height="70" rx="5" ry="5" fill="white" />
    
    <!-- Monitor Screen -->
    <rect x="45" y="45" width="110" height="50" fill="#dcdcdc" />

    <!-- Code Blocks (simulating code) -->
    <rect x="50" y="50" width="30" height="8" fill="#4caf50" />
    <rect x="50" y="60" width="50" height="8" fill="#2196f3" />
    <rect x="50" y="70" width="40" height="8" fill="#ff9800" />
  </svg>`

const FALLBACK_MED_RECTANGLE_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <!-- Background -->
    <rect width="200" height="200" fill="#f0f0f0" />

    <!-- Monitor Frame -->
    <rect x="30" y="30" width="140" height="80" rx="10" ry="10" fill="black" />
    <rect x="35" y="35" width="130" height="70" rx="5" ry="5" fill="white" />
    
    <!-- Monitor Screen -->
    <rect x="45" y="45" width="110" height="50" fill="#dcdcdc" />

    <!-- Code Blocks (simulating code) -->
    <rect x="50" y="50" width="30" height="8" fill="#4caf50" />
    <rect x="50" y="60" width="50" height="8" fill="#2196f3" />
    <rect x="50" y="70" width="40" height="8" fill="#ff9800" />
  </svg>`

const FALLBACK_SQUARE_DEFAULT_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <!-- Background -->
    <rect width="200" height="200" fill="#f0f0f0" />

    <!-- Monitor Frame -->
    <rect x="30" y="30" width="140" height="80" rx="10" ry="10" fill="black" />
    <rect x="35" y="35" width="130" height="70" rx="5" ry="5" fill="white" />
    
    <!-- Monitor Screen -->
    <rect x="45" y="45" width="110" height="50" fill="#dcdcdc" />

    <!-- Code Blocks (simulating code) -->
    <rect x="50" y="50" width="30" height="8" fill="#4caf50" />
    <rect x="50" y="60" width="50" height="8" fill="#2196f3" />
    <rect x="50" y="70" width="40" height="8" fill="#ff9800" />
  </svg>`
