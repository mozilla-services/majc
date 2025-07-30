import { ImageAd, Spoc, UaTile } from "@heyapi"

declare global {
  var __gpp: GPPFunction | undefined
}

// https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform/blob/main/Core/CMP%20API%20Specification.md#what-required-api-commands-must-a-cmp-support-
export interface GPPCommand {
  addEventListener: GPPAddEventListenerCallback
  getField: GPPGetFieldCallback
  getSection: GPPGetSectionCallback
  hasSection: GPPHasSectionCallback
  ping: GPPPingCallback
  removeEventListener: GPPRemoveEventListenerCallback
}

export type GPPAddEventListenerCallback = (data: GPPEvent, success: boolean) => void
export type GPPGetFieldCallback = (data: unknown | null, success: boolean) => void
export type GPPGetSectionCallback = (data: unknown[] | null, success: boolean) => void
export type GPPHasSectionCallback = (data: boolean, success: boolean) => void
export type GPPPingCallback = (data: GPPPing, success: boolean) => void
export type GPPRemoveEventListenerCallback = (data: boolean, success: boolean) => void

// https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform/blob/main/Core/CMP%20API%20Specification.md#pingreturn-
export interface GPPEvent {
  eventName: string
  listenerId: number
  data: unknown
  pingData: GPPPing
}

// https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform/blob/main/Core/CMP%20API%20Specification.md#pingreturn-
export interface GPPPing {
  gppVersion: string
  cmpStatus: string
  cmpDisplayStatus: string
  signalStatus: string
  supportedAPIs: string[]
  cmpId: number
  sectionList: number[]
  applicableSections: number[]
  gppString: string
  parsedSections: Record<string, unknown[]>
}

// https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform/blob/main/Core/CMP%20API%20Specification.md#how-does-the-cmp-provide-the-api
export type GPPFunction = <K extends keyof GPPCommand>(
  command: K,
  callback: GPPCommand[K],
  parameter?: unknown,
  version?: string,
) => void

// https://www.iab.com/wp-content/uploads/2019/04/IABNewAdPortfolio_LW_FixedSizeSpec.pdf
export type IABAdUnitFormatType = "Billboard"
  | "SmartphoneBanner300"
  | "SmartphoneBanner320"
  | "Leaderboard"
  | "SuperLeaderboardPushdown"
  | "Portrait"
  | "Skyscraper"
  | "MediumRectangle"
  | "TwentyBySixty"
  | "MobilePhoneInterstitial640"
  | "MobilePhoneInterstitial750"
  | "MobilePhoneInterstitial1080"
  | "FeaturePhoneSmallBanner"
  | "FeaturePhoneMediumBanner"
  | "FeaturePhoneLargeBanner"

export type NonIABAdUnitFormatType = "NewTab"

export type AdUnitFormatType = IABAdUnitFormatType | NonIABAdUnitFormatType

// Lookup key in the format `${width}x${height}`
export type AdUnitFormatTypeLookupKey = `${number}x${number}`

export type HTTPSURLString = `https://${string}.${string}`

export interface ImpressionThreshold {
  percent: number
  duration: number
}

export type IABContentTaxonomyType = "IAB-1.0"
  | "IAB-2.0"
  | "IAB-2.1"
  | "IAB-2.2"
  | "IAB-3.0"

export interface IABContent {
  taxonomy: IABContentTaxonomyType // https://iabtechlab.com/standards/content-taxonomy/
  categoryIds: string[] // https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf
}

// If you are adding a new log type, remember to include it in `docs/logging.md`
export type LogType = "logReporter.init.success"
  | "recordClick.clickOccurred"
  | "recordClick.success"
  | "recordClick.callbackResponseError"
  | "recordClick.invalidCallbackError"
  | "renderPlacement.reportCallbackResponseError"
  | "renderPlacement.reportCallbackInvalid"
  | "renderPlacement.buildersReportCallbackError"
  | "fetchAds.request.success"
  | "fetchAds.request.error"
  | "impressionObserver.recordImpression.viewed"
  | "impressionObserver.recordImpression.callbackResponseError"
  | "impressionObserver.recordImpression.invalidCallbackError"
  | "impressionObserver.observeAd.adNotFoundError"
  | "impressionObserver.forceRecordImpression.error"
  | "placementComponent.adLoad.success"
  | "placementComponent.adLoad.failure"
  | "placementComponent.render.error"

export type TelemetryEventLabel = "init"
  | "render_error"
  | "ad_load_error"
  | "fetch_error"
  | "invalid_url_error"

export type HttpRequestMethod = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH"

export type MozAdsPlacements = Record<string, MozAdsPlacementConfig | MozAdsPlacementWithContent>

export interface MozAdsRenderPlacementEvent {
  placement?: MozAdsPlacementWithContent
}

export interface MozAdsRenderPlacementReportEvent extends MozAdsRenderPlacementEvent {
  reason: string
}

export interface MozAdsRenderPlacementErrorEvent extends MozAdsRenderPlacementEvent {
  error: Error
}

export interface MozAdsPlacementConfig {
  placementId: string // https://github.com/mozilla-services/mars/blob/main/unified_ads_api/models/constants.go
  fixedSize?: MozAdsSize
  iabContent?: IABContent

  onClick?: (event: MozAdsRenderPlacementEvent) => void
  onReport?: (event: MozAdsRenderPlacementReportEvent) => void
  onError?: (event: MozAdsRenderPlacementErrorEvent) => void
  onLoad?: (event: MozAdsRenderPlacementEvent) => void
}

export interface MozAdsPlacementWithContent extends MozAdsPlacementConfig {
  content?: MozAdsContent
}

export type MozAdsContent = ImageAd | Spoc | UaTile

export interface MozAdsSize {
  width: number
  height: number
}
