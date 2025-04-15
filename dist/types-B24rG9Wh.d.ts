import { I as ImageAd, S as Spoc, U as UaTile } from './types.gen-D4NshL2B.js';

type IABAdUnitFormatType = 'Billboard' | 'SmartphoneBanner300' | 'SmartphoneBanner320' | 'Leaderboard' | 'SuperLeaderboardPushdown' | 'Portrait' | 'Skyscraper' | 'MediumRectangle' | 'TwentyBySixty' | 'MobilePhoneInterstitial640' | 'MobilePhoneInterstitial750' | 'MobilePhoneInterstitial1080' | 'FeaturePhoneSmallBanner' | 'FeaturePhoneMediumBanner' | 'FeaturePhoneLargeBanner';
type NonIABAdUnitFormatType = 'NewTab';
type IABContentTaxonomyType = 'IAB-1.0' | 'IAB-2.0' | 'IAB-2.1' | 'IAB-2.2' | 'IAB-3.0';
interface IABContent {
    taxonomy: IABContentTaxonomyType;
    categoryIds: string[];
}
type LogType = 'logReporter.init.success' | 'recordClick.clickOccurred' | 'recordClick.success' | 'recordClick.callbackResponseError' | 'recordClick.callbackNotFoundError' | 'renderPlacement.reportCallbackResponseError' | 'renderPlacement.reportCallbackNotFoundError' | 'renderPlacement.reportCallbackInvalid' | 'fetchAds.request.success' | 'fetchAds.request.error' | 'impressionObserver.recordImpression.viewed' | 'impressionObserver.recordImpression.callbackResponseError' | 'impressionObserver.recordImpression.callbackNotFoundError' | 'impressionObserver.observeAd.adNotFoundError' | 'impressionObserver.forceRecordImpression.error' | 'placementComponent.adLoad.success' | 'placementComponent.adLoad.failure' | 'placementComponent.render.error';
type TelemetryEventLabel = 'init' | 'render_error' | 'ad_load_error' | 'fetch_error' | 'invalid_url_error';
type HttpRequestMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';
type MozAdsPlacements = Record<string, MozAdsPlacementConfig | MozAdsPlacementWithContent>;
interface MozAdsRenderPlacementEvent {
    placement?: MozAdsPlacementWithContent;
}
interface MozAdsRenderPlacementReportEvent extends MozAdsRenderPlacementEvent {
    reason: string;
}
interface MozAdsRenderPlacementErrorEvent extends MozAdsRenderPlacementEvent {
    error: Error;
}
interface MozAdsPlacementConfig {
    placementId: string;
    fixedSize?: MozAdsSize;
    iabContent?: IABContent;
    onClick?: (event: MozAdsRenderPlacementEvent) => void;
    onReport?: (event: MozAdsRenderPlacementReportEvent) => void;
    onError?: (event: MozAdsRenderPlacementErrorEvent) => void;
    onLoad?: (event: MozAdsRenderPlacementEvent) => void;
}
interface MozAdsPlacementWithContent extends MozAdsPlacementConfig {
    content?: MozAdsContent;
}
type MozAdsContent = ImageAd | Spoc | UaTile;
interface MozAdsSize {
    width: number;
    height: number;
}

export type { HttpRequestMethod as H, IABAdUnitFormatType as I, LogType as L, MozAdsPlacementWithContent as M, NonIABAdUnitFormatType as N, TelemetryEventLabel as T, MozAdsSize as a, MozAdsRenderPlacementEvent as b, MozAdsRenderPlacementReportEvent as c, MozAdsRenderPlacementErrorEvent as d, MozAdsPlacements as e, IABContentTaxonomyType as f, IABContent as g, MozAdsPlacementConfig as h, MozAdsContent as i };
