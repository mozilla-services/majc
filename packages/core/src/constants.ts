import { IABAdUnitFormatType, MozAdsSize, NonIABAdUnitFormatType } from './types'

export const IS_BROWSER = typeof window !== 'undefined'
export const DEFAULT_SERVICE_ENDPOINT = 'https://ads.allizom.org/'

// https://www.iab.com/wp-content/uploads/2019/04/IABNewAdPortfolio_LW_FixedSizeSpec.pdf
export const IABFixedSize: Record<IABAdUnitFormatType, MozAdsSize> = {
  Billboard: {
    width: 970,
    height: 250,
  },
  SmartphoneBanner300: {
    width: 300,
    height: 50,
  },
  SmartphoneBanner320: {
    width: 320,
    height: 50,
  },
  Leaderboard: {
    width: 728,
    height: 90,
  },
  SuperLeaderboardPushdown: {
    width: 970,
    height: 90,
  },
  Portrait: {
    width: 300,
    height: 1050,
  },
  Skyscraper: {
    width: 160,
    height: 600,
  },
  MediumRectangle: {
    width: 300,
    height: 250,
  },
  TwentyBySixty: {
    width: 120,
    height: 60,
  },
  MobilePhoneInterstitial640: {
    width: 640,
    height: 1136,
  },
  MobilePhoneInterstitial750: {
    width: 750,
    height: 1334,
  },
  MobilePhoneInterstitial1080: {
    width: 1080,
    height: 1920,
  },
  FeaturePhoneSmallBanner: {
    width: 120,
    height: 20,
  },
  FeaturePhoneMediumBanner: {
    width: 168,
    height: 28,
  },
  FeaturePhoneLargeBanner: {
    width: 216,
    height: 36,
  },
} as const

// Given an ad format, this allows us to go from a '${width}x${height}' to an IABAdUnitFormatType
export const IABFixedSizeLookup: Record<`${number}x${number}`, IABAdUnitFormatType> = Object.entries(IABFixedSize).reduce(
  (acc: typeof IABFixedSizeLookup, curr) => {
    const formatName = curr[0] as IABAdUnitFormatType
    acc[`${curr[1].width}x${curr[1].height}`] = formatName

    return acc
  }, {})

export const NonIABFixedSize: Record<NonIABAdUnitFormatType, MozAdsSize> = {
  NewTab: {
    width: 200,
    height: 200,
  },
} as const

export const FixedSize: Record<IABAdUnitFormatType | NonIABAdUnitFormatType, MozAdsSize> = {
  ...IABFixedSize,
  ...NonIABFixedSize,
} as const

export const FallbackAdURL: Partial<Record<IABAdUnitFormatType, string>> = {
  Billboard: 'https://foundation.mozilla.org/?form=Donate_New_Tab&utm_source=newtab&utm_medium=firefox-desktop&utm_campaign=25-fund-nta&utm_content=Billboard-1940x500&utm_term=en',
  Skyscraper: 'https://foundation.mozilla.org/?form=Donate_New_Tab&utm_source=newtab&utm_medium=firefox-desktop&utm_campaign=25-fund-nta&utm_content=Skyscraper-120x600&utm_term=en',
  MediumRectangle: 'https://foundation.mozilla.org/?form=Donate_New_Tab&utm_source=newtab&utm_medium=firefox-desktop&utm_campaign=25-fund-nta&utm_content=MREC-300x250&utm_term=en',
} as const

// Impression Settings
export const DEFAULT_IMPRESSION_VIEW_THRESHOLD: Record<string, number> = {
  pocket_billboard: 0.3,
  pocket_billboard_1: 0.3,
  pocket_billboard_2: 0.3,
  pocket_skyscraper: 0.5,
  pocket_skyscraper_1: 0.5,
  pocket_skyscraper_2: 0.5,
}
export const FALLBACK_IMPRESSION_VIEW_THRESHOLD = 0.5
export const DEFAULT_IMPRESSION_TIME_THRESHOLD_MS: Record<string, number> = {
  pocket_billboard: 1_000,
  pocket_billboard_1: 1_000,
  pocket_billboard_2: 1_000,
  pocket_skyscraper: 1_000,
  pocket_skyscraper_1: 1_000,
  pocket_skyscraper_2: 1_000,
}
export const FALLBACK_IMPRESSION_TIME_THRESHOLD = 1_000
export const FALLBACK_IMPRESSION_ENDPOINT = ''

// Logging & Instrumentation
export const INSTRUMENT_ENDPOINT = 'https://ads.allizom.org/v1/log'
export const LOG_TO_CONSOLE_FLAG_DEFAULT = true
export const LOG_EMIT_FLAG_DEFAULT = true
