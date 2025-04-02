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
    taxonomy: string;
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
    iabContentCategoryIds?: string[];
    fixedSize?: MozAdsSize;
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

declare function recordClick(placement: MozAdsPlacementWithContent): Promise<void>;

declare const IS_BROWSER: boolean;
declare const DEFAULT_SERVICE_ENDPOINT = "https://ads.allizom.org/";
declare const IABFixedSize: Record<IABAdUnitFormatType, MozAdsSize>;
declare const NonIABFixedSize: Record<NonIABAdUnitFormatType, MozAdsSize>;
declare const FixedSize: Record<IABAdUnitFormatType | NonIABAdUnitFormatType, MozAdsSize>;
declare const DEFAULT_IMPRESSION_VIEW_THRESHOLD: Record<string, number>;
declare const FALLBACK_IMPRESSION_VIEW_THRESHOLD = 0.5;
declare const DEFAULT_IMPRESSION_TIME_THRESHOLD_MS: Record<string, number>;
declare const FALLBACK_IMPRESSION_TIME_THRESHOLD = 1000;
declare const FALLBACK_IMPRESSION_ENDPOINT = "";
declare const INSTRUMENT_ENDPOINT = "https://ads.allizom.org/v1/log";
declare const LOG_TO_CONSOLE_FLAG_DEFAULT = true;
declare const LOG_EMIT_FLAG_DEFAULT = true;

interface MozAdsRenderPlacementProps {
    placement: MozAdsPlacementWithContent;
    onClick?: (event: MozAdsRenderPlacementEvent) => void;
    onReport?: (event: MozAdsRenderPlacementReportEvent) => void;
    onError?: (event: MozAdsRenderPlacementErrorEvent) => void;
    onLoad?: (event: MozAdsRenderPlacementEvent) => void;
}
declare function preloadImage(imageUrl: string): Promise<HTMLImageElement>;
declare function renderPlacement(element: HTMLElement, { placement, onClick, onError, onLoad, onReport }: MozAdsRenderPlacementProps): void;

declare class FetchAdsError extends Error {
    cause: Error;
    name: string;
    constructor(cause: Error);
}
interface FetchAdsParams {
    placements: MozAdsPlacements;
    contextId?: string;
    serviceEndpoint?: string;
}
declare const fetchAds: ({ placements, contextId, serviceEndpoint, }: FetchAdsParams) => Promise<MozAdsPlacements>;
declare function buildPlacementsRequest(placements: MozAdsPlacements): AdPlacement[];
/**
 * Maps the ad content from the UAPI response to corresponding placement IDs of given configs.
 *
 * Note: This function makes no guarantee that all given placement IDs will have defined `adContent`.
 */
declare function mapResponseToPlacementsWithContent(response: AdResponse, placements: MozAdsPlacements): MozAdsPlacements;

declare const CLOSE_ICON_SVG = "\n  <svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" stroke=\"none\" viewBox=\"0 0 24 24\">\n    <path stroke-linecap=\"round\" stroke-width=\"2\" d=\"M6 6l12 12M6 18L18 6\"/>\n  </svg>\n";
declare const REPORT_ICON_SVG = "\n  <svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" stroke=\"none\" viewBox=\"0 0 16 16\">\n    <path d=\"M8.372 2.238a8.59 8.446 0 0 0-3.07.555c-2.477.937-4.009 2.856-4.009 5.031 0 .758.19 1.502.55 2.171L.64 12.745a.903.887 0 0 0 1.062 1.205l3.88-.984a8.733 8.733 0 0 0 2.8.457h.019c2.662 0 5.075-1.152 6.298-3.004.52-.767.8-1.668.804-2.59v-.277a.433.426 0 0 0-.028-.06c-.206-2.843-3.08-5.103-6.688-5.253h-.416Zm.047 1.67a.898.883 0 0 1 .9.884v2.822a.902.886 0 0 1-.9.886.902.886 0 0 1-.9-.885V4.792a.898.883 0 0 1 .9-.884Zm0 5.812a1.13 1.11 0 0 1 1.11 1.323 1.128 1.109 0 1 1-1.11-1.323Z\"/>\n  </svg>\n";

type MozAdsImpressionTracker = Record<string, PlacementImpressionInfo>;
interface PlacementImpressionInfo {
    viewStatus: 'unseen' | 'in-view' | 'viewed';
    viewThreshold: number;
    timeThreshold: number;
    impressionUrl: string;
    timeout?: ReturnType<typeof setTimeout>;
}
interface MozAdsImpressionObserver {
    impressionTracker: MozAdsImpressionTracker;
    observe: (placement: MozAdsPlacementWithContent) => void;
    unobserve: (placementId: string) => void;
}
declare class DefaultMozAdsImpressionObserver implements MozAdsImpressionObserver {
    intersectionObserver?: IntersectionObserver;
    impressionTracker: MozAdsImpressionTracker;
    constructor();
    private recordImpression;
    forceRecordImpression(placement: MozAdsPlacementWithContent): void;
    observe(placement: MozAdsPlacementWithContent): void;
    unobserve(placementId: string): void;
    private observeAgainLater;
    private intersectionCallback;
}
declare const defaultImpressionObserver: DefaultMozAdsImpressionObserver;

declare enum SeverityLevel {
    Emergency = 0,
    Alert = 1,
    Critical = 2,
    Error = 3,
    Warning = 4,
    Notice = 5,
    Info = 6,
    Debug = 7
}
interface MozLogMessage {
    Timestamp: number;
    Type?: string;
    Logger?: string;
    Hostname?: string;
    EnvVersion?: string;
    Severity?: SeverityLevel;
    Pid?: number;
    Fields?: {
        agent?: string;
        errorId?: string;
        method?: HttpRequestMethod;
        msg?: string;
        path?: string;
        placementId?: string;
        lang?: string;
    };
}
interface LogEmitterOptions {
    type?: LogType;
    eventLabel?: TelemetryEventLabel;
    logger?: string;
    hostname?: string;
    envVersion?: string;
    severity?: SeverityLevel;
    pid?: number;
    agent?: string;
    errorId?: string;
    method?: HttpRequestMethod;
    path?: string;
    placementId?: string;
    lang?: string;
}
interface LogReporter {
    emitLog: (msg: string, options: LogEmitterOptions) => Promise<void>;
    flush: () => void;
}
interface DefaultLogReporterConfig {
    name?: string;
    defaultOptions?: LogEmitterOptions;
    limiterOps?: {
        dupLogTimeLimit: number;
        dupLogCountLimit: number;
    };
}
declare class DefaultLogReporter implements LogReporter {
    namePrefix: string;
    defaultOptions: LogEmitterOptions;
    logLimiter: {
        [key: string]: {
            count: number;
            firstTs: number;
        };
    };
    dupLogTimeLimit: number;
    dupLogCountLimit: number;
    constructor(config?: DefaultLogReporterConfig);
    emitLog(msg: string, options?: LogEmitterOptions): Promise<void>;
    flush(): void;
    formatClientLog(msg: string, opts?: LogEmitterOptions): MozLogMessage;
    private handleLogRateLimit;
    private makeLogLimiterKey;
}
declare const defaultLogReporter: DefaultLogReporter;

type MozAdsLocalizedStringKey = 'ad_image_default_alt' | 'loading_spinner_tooltip' | 'report_ad_button_tooltip' | 'report_form_close_button_tooltip' | 'report_form_select_reason_option_none' | 'report_form_select_reason_option_inappropriate' | 'report_form_select_reason_option_seen_multiple_times' | 'report_form_select_reason_option_not_interested' | 'report_form_submit_button' | 'report_form_title_default' | 'report_form_title_success';
declare function l(key: MozAdsLocalizedStringKey): string;

declare enum LoggerLevel {
    None = 0,
    Error = 1,
    Warn = 2,
    Info = 3,
    Debug = 4
}
interface LoggerConfig {
    name: string;
    logToConsole?: boolean;
    level?: LoggerLevel;
    emitLogs?: boolean;
}
interface LogFields {
    type?: LogType;
    eventLabel?: TelemetryEventLabel;
    method?: HttpRequestMethod;
    path?: string;
    placementId?: string;
    errorId?: string;
}
interface Logger {
    get name(): string;
    get level(): LoggerLevel;
    debug: (msg: string, extras?: LogFields) => void;
    log: (msg: string, extras?: LogFields) => void;
    info: (msg: string, extras?: LogFields) => void;
    warn: (msg: string, extras?: LogFields) => void;
    error: (msg: string, extras?: LogFields) => void;
}
declare class DefaultLogger implements Logger {
    readonly name: string;
    readonly level: LoggerLevel;
    readonly logToConsole: boolean;
    readonly emitLogs: boolean;
    constructor(config: LoggerConfig);
    debug(msg: string, extras?: LogFields): void;
    log(msg: string, extras?: LogFields): void;
    info(msg: string, extras?: LogFields): void;
    warn(msg: string, extras?: LogFields): void;
    error(msg: string, extras?: LogFields): void;
    private emitLog;
}

type MozAdsStoreKey = 'contextId';
declare enum StoreType {
    Persistent = 0,
    SessionOnly = 1
}
declare const getItemFromStore: (key: MozAdsStoreKey, storeType?: StoreType) => string | null;
declare const setItemInStore: (key: MozAdsStoreKey, value: string, storeType?: StoreType) => void;
declare const removeItemFromStore: (key: MozAdsStoreKey, storeType?: StoreType) => void;
declare const getOrGenerateContextId: (forceRegenerate?: boolean) => string;

export { CLOSE_ICON_SVG, DEFAULT_IMPRESSION_TIME_THRESHOLD_MS, DEFAULT_IMPRESSION_VIEW_THRESHOLD, DEFAULT_SERVICE_ENDPOINT, DefaultLogReporter, type DefaultLogReporterConfig, DefaultLogger, DefaultMozAdsImpressionObserver, FALLBACK_IMPRESSION_ENDPOINT, FALLBACK_IMPRESSION_TIME_THRESHOLD, FALLBACK_IMPRESSION_VIEW_THRESHOLD, FetchAdsError, type FetchAdsParams, FixedSize, type HttpRequestMethod, type IABAdUnitFormatType, IABFixedSize, INSTRUMENT_ENDPOINT, IS_BROWSER, LOG_EMIT_FLAG_DEFAULT, LOG_TO_CONSOLE_FLAG_DEFAULT, type LogEmitterOptions, type LogFields, type LogReporter, type LogType, type Logger, type LoggerConfig, LoggerLevel, type MozAdsContent, type MozAdsImpressionObserver, type MozAdsImpressionTracker, type MozAdsLocalizedStringKey, type MozAdsPlacementConfig, type MozAdsPlacementWithContent, type MozAdsPlacements, type MozAdsRenderPlacementErrorEvent, type MozAdsRenderPlacementEvent, type MozAdsRenderPlacementProps, type MozAdsRenderPlacementReportEvent, type MozAdsSize, type MozAdsStoreKey, type MozLogMessage, type NonIABAdUnitFormatType, NonIABFixedSize, type PlacementImpressionInfo, REPORT_ICON_SVG, SeverityLevel, StoreType, type TelemetryEventLabel, buildPlacementsRequest, defaultImpressionObserver, defaultLogReporter, fetchAds, getItemFromStore, getOrGenerateContextId, l, mapResponseToPlacementsWithContent, preloadImage, recordClick, removeItemFromStore, renderPlacement, setItemInStore };
