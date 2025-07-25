import {
  AdUnitFormatType,
  AdUnitFormatTypeLookupKey,
  HTTPSURLString,
  IABAdUnitFormatType,
  ImpressionThreshold,
  MozAdsSize,
  NonIABAdUnitFormatType,
} from "./types"

export const IS_BROWSER = typeof window !== "undefined"
export const IS_PRODUCTION = process.env.NODE_ENV === "production"

export const DEFAULT_SERVICE_ENDPOINT: HTTPSURLString = IS_PRODUCTION
  ? "https://ads.mozilla.org/" // production
  : "https://ads.allizom.org/" // staging
export const INSTRUMENT_ENDPOINT: HTTPSURLString = `${DEFAULT_SERVICE_ENDPOINT}v1/log`

export const LOG_TO_CONSOLE_FLAG_DEFAULT = !IS_PRODUCTION
export const LOG_EMIT_FLAG_DEFAULT = true

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

export const NonIABFixedSize: Record<NonIABAdUnitFormatType, MozAdsSize> = {
  NewTab: {
    width: 200,
    height: 200,
  },
} as const

export const FixedSize: Record<AdUnitFormatType, MozAdsSize> = {
  ...IABFixedSize,
  ...NonIABFixedSize,
} as const

// Create a mapping object to find an AdUnitFormatType from a AdUnitFormatTypeLookupKey
export const AdUnitFormatTypeLookup: Record<AdUnitFormatTypeLookupKey, AdUnitFormatType> = Object.entries(FixedSize).reduce(
  (acc: typeof AdUnitFormatTypeLookup, curr) => {
    const formatName = curr[0] as AdUnitFormatType
    acc[`${curr[1].width}x${curr[1].height}`] = formatName

    return acc
  }, {})

export const FallbackAdURL: Partial<Record<AdUnitFormatType, HTTPSURLString>> = {
  Billboard: "https://foundation.mozilla.org/?form=Donate_New_Tab&utm_source=newtab&utm_medium=firefox-desktop&utm_campaign=25-fund-nta&utm_content=Billboard-1940x500&utm_term=en",
  Skyscraper: "https://foundation.mozilla.org/?form=Donate_New_Tab&utm_source=newtab&utm_medium=firefox-desktop&utm_campaign=25-fund-nta&utm_content=Skyscraper-120x600&utm_term=en",
  MediumRectangle: "https://foundation.mozilla.org/?form=Donate_New_Tab&utm_source=newtab&utm_medium=firefox-desktop&utm_campaign=25-fund-nta&utm_content=MREC-300x250&utm_term=en",
} as const

export const AdUnitFormatImpressionThreshold: Record<AdUnitFormatType, ImpressionThreshold> = {
  Billboard: {
    percent: 0.3,
    duration: 1_000,
  },
  SmartphoneBanner300: {
    percent: 0.5,
    duration: 1_000,
  },
  SmartphoneBanner320: {
    percent: 0.5,
    duration: 1_000,
  },
  Leaderboard: {
    percent: 0.5,
    duration: 1_000,
  },
  SuperLeaderboardPushdown: {
    percent: 0.5,
    duration: 1_000,
  },
  Portrait: {
    percent: 0.5,
    duration: 1_000,
  },
  Skyscraper: {
    percent: 0.5,
    duration: 1_000,
  },
  MediumRectangle: {
    percent: 0.5,
    duration: 1_000,
  },
  TwentyBySixty: {
    percent: 0.5,
    duration: 1_000,
  },
  MobilePhoneInterstitial640: {
    percent: 0.5,
    duration: 1_000,
  },
  MobilePhoneInterstitial750: {
    percent: 0.5,
    duration: 1_000,
  },
  MobilePhoneInterstitial1080: {
    percent: 0.5,
    duration: 1_000,
  },
  FeaturePhoneSmallBanner: {
    percent: 0.5,
    duration: 1_000,
  },
  FeaturePhoneMediumBanner: {
    percent: 0.5,
    duration: 1_000,
  },
  FeaturePhoneLargeBanner: {
    percent: 0.5,
    duration: 1_000,
  },
  NewTab: {
    percent: 0.5,
    duration: 1_000,
  },
} as const

export const DefaultImpressionThreshold: ImpressionThreshold = {
  percent: 0.5,
  duration: 1_000,
} as const
