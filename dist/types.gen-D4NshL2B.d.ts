type SpocRequest = {
    /**
     * API version
     */
    version: number;
    /**
     * Identifies that the request is coming from Firefox.
     */
    consumer_key: string;
    /**
     * ID that uniquely identifies a session.
     */
    pocket_id: string;
    placements?: Array<Placement>;
    /**
     * override siteId in ad decision requests
     */
    site?: number;
    /**
     * override country in keywords of ad decision requests for testing
     */
    country?: string;
    /**
     * override region in keywords of ad decision requests for testing
     */
    region?: string;
};
/**
 * Placement describes parameters for a set of ads to return
 */
type Placement = {
    /**
     * Corresponds to the key in the response object.
     */
    name: string;
    /**
     * IDs of Ad Types, indicating the size & dimensions of the ads to return.
     */
    ad_types?: Array<number>;
    /**
     * ID of Zones, indicating what area these ads will be shown.
     */
    zone_ids?: Array<number>;
    /**
     * number of ads to return for this placement
     */
    count?: number;
};
type Settings = {
    spocsPerNewTabs: number;
    domainAffinityParameterSets: {
        [key: string]: DomainAffinityParameterSet;
    };
    timeSegments: Array<TimeSegment>;
    feature_flags: FeatureFlags;
};
type FeatureFlags = {
    spoc_v2: boolean;
    collections: boolean;
};
type DomainAffinityParameterSet = {
    recencyFactor: number;
    frequencyFactor: number;
    combinedDomainFactor: number;
    perfectFrequencyVisits?: number;
    perfectCombinedDomainScore: number;
    multiDomainBoost: number;
    itemScoreFactor: number;
};
type TimeSegment = {
    id: string;
    startTime: number;
    endTime: number;
    weightPosition: unknown;
};
type SpocFeed = Array<SpocFeedItem> | {
    title: string;
    flight_id: number;
    sponsor?: string;
    context?: string;
    items?: Array<SpocFeedItem>;
};
type Shim = {
    click?: string;
    impression?: string;
    delete?: string;
    save?: string;
};
type Caps = {
    lifetime: number;
    flight: {
        count: number;
        /**
         * Period in seconds
         */
        period: number;
    };
    campaign: {
        count: number;
        /**
         * Period in seconds
         */
        period: number;
    };
};
type SpocFeedItem = {
    campaign_id?: number;
    caps?: Caps;
    /**
     * Shared title if all ads are one collection
     */
    collection_title?: string;
    /**
     * Deprecated. Use sponsor field instead.
     */
    context?: string;
    /**
     * Text to display on CTA button
     */
    cta?: string;
    domain?: string;
    domain_affinities?: {
        [key: string]: number;
    };
    excerpt?: string;
    flight_id?: number;
    id?: number;
    image_src?: string;
    is_video?: boolean;
    item_score?: number;
    min_score?: number;
    parameter_set?: string;
    personalization_models?: {
        [key: string]: unknown;
    };
    /**
     * The priority order. 1-100, 1 is highest priority.
     */
    priority?: number;
    raw_image_src?: string;
    shim?: Shim;
    sponsor?: string;
    sponsored_by_override?: string;
    title?: string;
    url?: string;
};
/**
 * tile format
 */
type Tile = {
    /**
     * Partner specific id for ad
     */
    id: number;
    /**
     * Advertiser name
     */
    name: string;
    /**
     * Advertiser URL
     */
    url: string;
    /**
     * Click counting URL
     */
    click_url: string;
    /**
     * Ad image
     */
    image_url: string;
    /**
     * Image size
     */
    image_size: number | null;
    /**
     * Impression counting URL
     */
    impression_url: string;
};
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
type AdRequest = {
    /**
     * An identifier for the user's context.
     */
    context_id: string;
    /**
     * A list of `AdPlacement` objects, specifying where ads should be placed.
     */
    placements: Array<AdPlacement>;
    /**
     * A list of strings specifying blocked content. The string values come from the `block_key` field in returned ads.
     */
    blocks?: Array<string>;
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
/**
 * An empty response object
 */
type TelemetryResponse = {
    [key: string]: unknown;
};
type GetAdsData = {
    body: AdRequest;
    path?: never;
    query?: never;
    url: '/v1/ads';
};
type GetAdsErrors = {
    /**
     * Bad Request. Requests are invalid if they contain unsupported placements or request too many ads for a placement.
     */
    400: unknown;
};
type GetAdsResponses = {
    /**
     * Successful response. The response can still be empty, no error codes will be returned if no ads can be served after being filtered for correctness and being on the block list.
     */
    200: AdResponse;
};
type GetAdsResponse = GetAdsResponses[keyof GetAdsResponses];
type GetV1tData = {
    body?: never;
    path?: never;
    query: {
        /**
         * Encoded interaction data
         */
        data: string;
        /**
         * Identifier representing the instance of the placement (different identifier than placement from the ad request), used only in special situations.
         */
        placement_id?: string;
        /**
         * Identifier indicating the position of the placement (optional). May be a string or numeric.  If a numeric index is used it must be 0-based.
         */
        position?: string;
        /**
         * Identifier indicating the reason for the ad reporting interaction. Used only for, and required with, the 'report' action.
         */
        reason?: 'inappropriate' | 'not_interested' | 'seen_too_many_times';
    };
    url: '/v1/t';
};
type GetV1tResponses = {
    /**
     * Successful response
     */
    200: unknown;
};
type GetV1LogData = {
    body?: never;
    path?: never;
    query?: {
        /**
         * Identifier of the event to capture.
         */
        event?: 'init' | 'error';
    };
    url: '/v1/log';
};
type GetV1LogErrors = {
    /**
     * Bad Request. Requests are invalid if they contain unsupported or empty events.
     */
    400: unknown;
};
type GetV1LogResponses = {
    /**
     * Successful response
     */
    200: unknown;
};
type DeleteV1DeleteUserData = {
    body: {
        context_id: string;
    };
    path?: never;
    query?: never;
    url: '/v1/delete_user';
};
type DeleteV1DeleteUserResponses = {
    /**
     * Successfully deleted user data.
     */
    200: unknown;
};
type GetV1ImagesData = {
    body?: never;
    path?: never;
    query: {
        /**
         * Encoded ad image url
         */
        image_data: string;
    };
    url: '/v1/images';
};
type GetV1ImagesResponses = {
    /**
     * Successful response
     */
    200: unknown;
};
type GetSpocsData = {
    body: SpocRequest;
    path?: never;
    query?: {
        /**
         * override siteId in ad decision requests
         */
        site?: number;
        /**
         * override region in keywords of ad decision requests for testing
         */
        region?: string;
        /**
         * override country in keywords of ad decision requests for testing
         */
        country?: string;
    };
    url: '/spocs';
};
type GetSpocsResponses = {
    /**
     * Responds with settings and a list of spocs.
     */
    200: {
        settings?: Settings;
        /**
         * Informational object returned in non-prod environments
         */
        __debug__?: {
            [key: string]: unknown;
        };
        [key: string]: SpocFeed | Settings | {
            [key: string]: unknown;
        } | undefined;
    };
};
type GetSpocsResponse = GetSpocsResponses[keyof GetSpocsResponses];
type DeleteUserData = {
    body: {
        /**
         * ID that uniquely identifies a session.
         */
        pocket_id: string;
    };
    path?: never;
    query?: never;
    url: '/user';
};
type DeleteUserResponses = {
    /**
     * Successfully deleted user data.
     */
    200: unknown;
};
type GetTilesData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/v1/tiles';
};
type GetTilesErrors = {
    /**
     * Tiles service is for Firefox only
     */
    403: unknown;
};
type GetTilesResponses = {
    /**
     * Get a list of tiles based on region. The IP address is used to deduce a rough geographic region, for example "Texas" in the U.S. or "England" in the U.K.
     */
    200: {
        tiles?: Array<Tile>;
        /**
         * SoV configuration
         */
        sov?: string;
    };
    /**
     * No tiles available
     */
    204: void;
};
type GetTilesResponse = GetTilesResponses[keyof GetTilesResponses];
type ClientOptions = {
    baseUrl: 'https://ads.mozilla.org' | (string & {});
};

export type { AdPlacement as A, GetV1tResponses as B, ClientOptions as C, DeleteV1DeleteUserData as D, GetV1LogErrors as E, FeatureFlags as F, GetAdsData as G, GetV1LogResponses as H, ImageAd as I, DeleteV1DeleteUserResponses as J, GetV1ImagesResponses as K, GetSpocsResponses as L, GetSpocsResponse as M, DeleteUserResponses as N, GetTilesErrors as O, Placement as P, GetTilesResponses as Q, Spoc as S, TimeSegment as T, UaTile as U, AdResponse as a, GetV1tData as b, GetV1LogData as c, GetV1ImagesData as d, GetSpocsData as e, Settings as f, SpocFeed as g, DeleteUserData as h, GetTilesData as i, GetTilesResponse as j, SpocRequest as k, DomainAffinityParameterSet as l, Shim as m, Caps as n, SpocFeedItem as o, Tile as p, AdRequest as q, AdContent as r, AdCallbacks as s, AdFormatBase as t, SpocFrequencyCaps as u, SpocRanking as v, TelemetryResponse as w, GetAdsErrors as x, GetAdsResponses as y, GetAdsResponse as z };
