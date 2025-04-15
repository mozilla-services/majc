type AdPlacement = {
    /**
     * Specifies the placement location of the ad. Values will be Mozilla supplied and specific to the integration.
     */
    placement: string;
    /**
     * The number of ads to be placed in the specified location.
     */
    count?: number;
    content?: AdContent;
};
type AdContent = {
    /**
     * A valid taxonomy identifier recognized by MARS
     */
    taxonomy: 'IAB-1.0' | 'IAB-2.0' | 'IAB-2.1' | 'IAB-2.2' | 'IAB-3.0';
    categories: Array<string>;
};
/**
 * An object containing callback URLs for interactions with an ad.
 */
type AdCallbacks = {
    /**
     * This URL should be requested with an HTTP GET when the ad is clicked. Response should be ignored.
     */
    click: string | null;
    /**
     * This URL should be requested with an HTTP GET when half of the ad is visible in the viewport for 1 second. If the ad's pixel size is greater that 242500 (970 * 250) only 30% visibility is required. Response should be ignored.
     */
    impression: string | null;
    /**
     * This URL may be issued by a client on behalf of a user to report an ad that is inappropriate or otherwise unsatisfying. Response should be ignored. The reason parameter is required with this action.
     */
    report?: string | null;
};
type AdFormatBase = {
    /**
     * The format type of the ad.
     */
    format?: string;
    /**
     * The target destination URL of the ad.
     */
    url?: string;
    callbacks?: AdCallbacks;
};
/**
 * Client-side enforced frequency capping information.
 */
type SpocFrequencyCaps = {
    /**
     * A key that identifies the frequency cap.
     */
    cap_key?: string;
    /**
     * Number of times to show the same ad during a one day period.
     */
    day?: number;
};
/**
 * Ranking information for personalized content.
 */
type SpocRanking = {
    /**
     * The priority in the ranking. Reranking of ads should prefer priority before personalization.
     */
    priority?: number;
    /**
     * A map of model names to scores for personalization.
     */
    personalization_models?: {
        [key: string]: number;
    };
    /**
     * The overall score for the item.
     */
    item_score?: number;
};
type ImageAd = AdFormatBase & {
    /**
     * URL of the ad image.
     */
    image_url?: string;
    /**
     * Alt text to describe the ad image.
     */
    alt_text?: string;
    /**
     * The block key generated for the advertiser.
     */
    block_key?: string;
};
type Spoc = AdFormatBase & {
    /**
     * URL of the ad image.
     */
    image_url?: string;
    /**
     * Title of the sponsored content.
     */
    title?: string;
    /**
     * The domain where the content is hosted.
     */
    domain?: string;
    /**
     * A short excerpt from the sponsored content.
     */
    excerpt?: string;
    /**
     * The name of the sponsor.
     */
    sponsor?: string;
    /**
     * An optional override for the sponsor name.
     */
    sponsored_by_override?: string | null;
    /**
     * The block key generated for the advertiser.
     */
    block_key?: string;
    caps?: SpocFrequencyCaps;
    ranking?: SpocRanking;
};
type UaTile = AdFormatBase & {
    /**
     * URL of the ad image.
     */
    image_url?: string;
    /**
     * The name displayed under the tile.
     */
    name?: string;
    /**
     * The block key generated for the advertiser.
     */
    block_key?: string;
};
type AdResponse = {
    [key: string]: Array<ImageAd | Spoc | UaTile>;
};

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

export type { AdPlacement as A, HttpRequestMethod as H, IABAdUnitFormatType as I, LogType as L, MozAdsPlacementWithContent as M, NonIABAdUnitFormatType as N, TelemetryEventLabel as T, MozAdsSize as a, MozAdsRenderPlacementEvent as b, MozAdsRenderPlacementReportEvent as c, MozAdsRenderPlacementErrorEvent as d, MozAdsPlacements as e, AdResponse as f, IABContentTaxonomyType as g, IABContent as h, MozAdsPlacementConfig as i, MozAdsContent as j };
