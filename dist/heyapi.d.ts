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
    consent?: Consent;
};
type AdContent = {
    /**
     * A valid taxonomy identifier recognized by MARS
     */
    taxonomy: 'IAB-1.0' | 'IAB-2.0' | 'IAB-2.1' | 'IAB-2.2' | 'IAB-3.0';
    categories: Array<string>;
};
/**
 * An object to specify consent specifiers for this request
 */
type Consent = {
    /**
     * Global Privacy Platform consent string
     */
    gpp?: string;
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
/**
 * An object containing attribution configuration for enabled ads.
 */
type Attributions = {
    /**
     * Advertising partner associated with the ad.
     */
    partner_id: string;
    conversion?: Task;
};
type Task = {
    /**
     * DAP task ID.
     */
    task_id: string;
    /**
     * DAP data type of the task.
     */
    vdaf: string;
    /**
     * DAP data size of the task.
     */
    bits?: number;
    /**
     * DAP legnth of the task.
     */
    length: number;
    /**
     * DAP time precision. Determines rounding of dates in DAP report.
     */
    time_precision: number;
    /**
     * Measurement to be used when a default report is sent.
     */
    default_measurement?: number;
    /**
     * Index allocated to be used when a non-default report is sent.
     */
    index: number;
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
    attributions?: Attributions;
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
type ClientOptions$1 = {
    baseUrl: 'https://ads.mozilla.org' | (string & {});
};

type AuthToken = string | undefined;
interface Auth {
    /**
     * Which part of the request do we use to send the auth?
     *
     * @default 'header'
     */
    in?: 'header' | 'query' | 'cookie';
    /**
     * Header or query parameter name.
     *
     * @default 'Authorization'
     */
    name?: string;
    scheme?: 'basic' | 'bearer';
    type: 'apiKey' | 'http';
}

interface SerializerOptions<T> {
    /**
     * @default true
     */
    explode: boolean;
    style: T;
}
type ArrayStyle = 'form' | 'spaceDelimited' | 'pipeDelimited';
type ObjectStyle = 'form' | 'deepObject';

type QuerySerializer = (query: Record<string, unknown>) => string;
type BodySerializer = (body: any) => any;
interface QuerySerializerOptions {
    allowReserved?: boolean;
    array?: SerializerOptions<ArrayStyle>;
    object?: SerializerOptions<ObjectStyle>;
}

interface Client$1<RequestFn = never, Config = unknown, MethodFn = never, BuildUrlFn = never> {
    /**
     * Returns the final request URL.
     */
    buildUrl: BuildUrlFn;
    connect: MethodFn;
    delete: MethodFn;
    get: MethodFn;
    getConfig: () => Config;
    head: MethodFn;
    options: MethodFn;
    patch: MethodFn;
    post: MethodFn;
    put: MethodFn;
    request: RequestFn;
    setConfig: (config: Config) => Config;
    trace: MethodFn;
}
interface Config$1 {
    /**
     * Auth token or a function returning auth token. The resolved value will be
     * added to the request payload as defined by its `security` array.
     */
    auth?: ((auth: Auth) => Promise<AuthToken> | AuthToken) | AuthToken;
    /**
     * A function for serializing request body parameter. By default,
     * {@link JSON.stringify()} will be used.
     */
    bodySerializer?: BodySerializer | null;
    /**
     * An object containing any HTTP headers that you want to pre-populate your
     * `Headers` object with.
     *
     * {@link https://developer.mozilla.org/docs/Web/API/Headers/Headers#init See more}
     */
    headers?: RequestInit['headers'] | Record<string, string | number | boolean | (string | number | boolean)[] | null | undefined | unknown>;
    /**
     * The request method.
     *
     * {@link https://developer.mozilla.org/docs/Web/API/fetch#method See more}
     */
    method?: 'CONNECT' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'TRACE';
    /**
     * A function for serializing request query parameters. By default, arrays
     * will be exploded in form style, objects will be exploded in deepObject
     * style, and reserved characters are percent-encoded.
     *
     * This method will have no effect if the native `paramsSerializer()` Axios
     * API function is used.
     *
     * {@link https://swagger.io/docs/specification/serialization/#query View examples}
     */
    querySerializer?: QuerySerializer | QuerySerializerOptions;
    /**
     * A function validating request data. This is useful if you want to ensure
     * the request conforms to the desired shape, so it can be safely sent to
     * the server.
     */
    requestValidator?: (data: unknown) => Promise<unknown>;
    /**
     * A function transforming response data before it's returned. This is useful
     * for post-processing data, e.g. converting ISO strings into Date objects.
     */
    responseTransformer?: (data: unknown) => Promise<unknown>;
    /**
     * A function validating response data. This is useful if you want to ensure
     * the response conforms to the desired shape, so it can be safely passed to
     * the transformers and returned to the user.
     */
    responseValidator?: (data: unknown) => Promise<unknown>;
}

type ErrInterceptor<Err, Res, Req, Options> = (error: Err, response: Res, request: Req, options: Options) => Err | Promise<Err>;
type ReqInterceptor<Req, Options> = (request: Req, options: Options) => Req | Promise<Req>;
type ResInterceptor<Res, Req, Options> = (response: Res, request: Req, options: Options) => Res | Promise<Res>;
declare class Interceptors<Interceptor> {
    _fns: (Interceptor | null)[];
    constructor();
    clear(): void;
    getInterceptorIndex(id: number | Interceptor): number;
    exists(id: number | Interceptor): boolean;
    eject(id: number | Interceptor): void;
    update(id: number | Interceptor, fn: Interceptor): number | false | Interceptor;
    use(fn: Interceptor): number;
}
interface Middleware<Req, Res, Err, Options> {
    error: Pick<Interceptors<ErrInterceptor<Err, Res, Req, Options>>, 'eject' | 'use'>;
    request: Pick<Interceptors<ReqInterceptor<Req, Options>>, 'eject' | 'use'>;
    response: Pick<Interceptors<ResInterceptor<Res, Req, Options>>, 'eject' | 'use'>;
}

type ResponseStyle = 'data' | 'fields';
interface Config<T extends ClientOptions = ClientOptions> extends Omit<RequestInit, 'body' | 'headers' | 'method'>, Config$1 {
    /**
     * Base URL for all requests made by this client.
     */
    baseUrl?: T['baseUrl'];
    /**
     * Fetch API implementation. You can use this option to provide a custom
     * fetch instance.
     *
     * @default globalThis.fetch
     */
    fetch?: (request: Request) => ReturnType<typeof fetch>;
    /**
     * Please don't use the Fetch client for Next.js applications. The `next`
     * options won't have any effect.
     *
     * Install {@link https://www.npmjs.com/package/@hey-api/client-next `@hey-api/client-next`} instead.
     */
    next?: never;
    /**
     * Return the response data parsed in a specified format. By default, `auto`
     * will infer the appropriate method from the `Content-Type` response header.
     * You can override this behavior with any of the {@link Body} methods.
     * Select `stream` if you don't want to parse response data at all.
     *
     * @default 'auto'
     */
    parseAs?: 'arrayBuffer' | 'auto' | 'blob' | 'formData' | 'json' | 'stream' | 'text';
    /**
     * Should we return only data or multiple fields (data, error, response, etc.)?
     *
     * @default 'fields'
     */
    responseStyle?: ResponseStyle;
    /**
     * Throw an error instead of returning it in the response?
     *
     * @default false
     */
    throwOnError?: T['throwOnError'];
}
interface RequestOptions<TResponseStyle extends ResponseStyle = 'fields', ThrowOnError extends boolean = boolean, Url extends string = string> extends Config<{
    responseStyle: TResponseStyle;
    throwOnError: ThrowOnError;
}> {
    /**
     * Any body that you want to add to your request.
     *
     * {@link https://developer.mozilla.org/docs/Web/API/fetch#body}
     */
    body?: unknown;
    path?: Record<string, unknown>;
    query?: Record<string, unknown>;
    /**
     * Security mechanism(s) to use for the request.
     */
    security?: ReadonlyArray<Auth>;
    url: Url;
}
type RequestResult<TData = unknown, TError = unknown, ThrowOnError extends boolean = boolean, TResponseStyle extends ResponseStyle = 'fields'> = ThrowOnError extends true ? Promise<TResponseStyle extends 'data' ? TData extends Record<string, unknown> ? TData[keyof TData] : TData : {
    data: TData extends Record<string, unknown> ? TData[keyof TData] : TData;
    request: Request;
    response: Response;
}> : Promise<TResponseStyle extends 'data' ? (TData extends Record<string, unknown> ? TData[keyof TData] : TData) | undefined : ({
    data: TData extends Record<string, unknown> ? TData[keyof TData] : TData;
    error: undefined;
} | {
    data: undefined;
    error: TError extends Record<string, unknown> ? TError[keyof TError] : TError;
}) & {
    request: Request;
    response: Response;
}>;
interface ClientOptions {
    baseUrl?: string;
    responseStyle?: ResponseStyle;
    throwOnError?: boolean;
}
type MethodFn = <TData = unknown, TError = unknown, ThrowOnError extends boolean = false, TResponseStyle extends ResponseStyle = 'fields'>(options: Omit<RequestOptions<TResponseStyle, ThrowOnError>, 'method'>) => RequestResult<TData, TError, ThrowOnError, TResponseStyle>;
type RequestFn = <TData = unknown, TError = unknown, ThrowOnError extends boolean = false, TResponseStyle extends ResponseStyle = 'fields'>(options: Omit<RequestOptions<TResponseStyle, ThrowOnError>, 'method'> & Pick<Required<RequestOptions<TResponseStyle, ThrowOnError>>, 'method'>) => RequestResult<TData, TError, ThrowOnError, TResponseStyle>;
type BuildUrlFn = <TData extends {
    body?: unknown;
    path?: Record<string, unknown>;
    query?: Record<string, unknown>;
    url: string;
}>(options: Pick<TData, 'url'> & Options$1<TData>) => string;
type Client = Client$1<RequestFn, Config, MethodFn, BuildUrlFn> & {
    interceptors: Middleware<Request, Response, unknown, RequestOptions>;
};
interface TDataShape {
    body?: unknown;
    headers?: unknown;
    path?: unknown;
    query?: unknown;
    url: string;
}
type OmitKeys<T, K> = Pick<T, Exclude<keyof T, K>>;
type Options$1<TData extends TDataShape = TDataShape, ThrowOnError extends boolean = boolean, TResponseStyle extends ResponseStyle = 'fields'> = OmitKeys<RequestOptions<TResponseStyle, ThrowOnError>, 'body' | 'path' | 'query' | 'url'> & Omit<TData, 'url'>;

type Options<TData extends TDataShape = TDataShape, ThrowOnError extends boolean = boolean> = Options$1<TData, ThrowOnError> & {
    /**
     * You can provide a client instance returned by `createClient()` instead of
     * individual options. This might be also useful if you want to implement a
     * custom client.
     */
    client?: Client;
    /**
     * You can pass arbitrary values through the `meta` object. This can be
     * used to access values that aren't defined as part of the SDK function.
     */
    meta?: Record<string, unknown>;
};
/**
 * Get Unified API ads
 */
declare const getAds: <ThrowOnError extends boolean = false>(options: Options<GetAdsData, ThrowOnError>) => RequestResult<GetAdsResponses, GetAdsErrors, ThrowOnError, "fields">;
/**
 * Report ad interaction
 * Interaction callback URLs are returned in an ad response. When the corresponding action on the client occurs, those URLs should be fetched.
 */
declare const getV1T: <ThrowOnError extends boolean = false>(options: Options<GetV1tData, ThrowOnError>) => RequestResult<GetV1tResponses, unknown, ThrowOnError, "fields">;
/**
 * Record client events
 * This endpoint can be used to persist a prometheus metric.
 */
declare const getV1Log: <ThrowOnError extends boolean = false>(options?: Options<GetV1LogData, ThrowOnError>) => RequestResult<GetV1LogResponses, GetV1LogErrors, ThrowOnError, "fields">;
/**
 * Delete user data
 * Delete any data persisted associated with a given context_id.
 */
declare const deleteV1DeleteUser: <ThrowOnError extends boolean = false>(options: Options<DeleteV1DeleteUserData, ThrowOnError>) => RequestResult<DeleteV1DeleteUserResponses, unknown, ThrowOnError, "fields">;
/**
 * Get ad image
 * Proxies an ad image from an encoded URL. Encoded image URLs are returned in an ad response, calls to this endpoint shouldn't be constructed manually.
 */
declare const getV1Images: <ThrowOnError extends boolean = false>(options: Options<GetV1ImagesData, ThrowOnError>) => RequestResult<GetV1ImagesResponses, unknown, ThrowOnError, "fields">;
/**
 * (legacy) Get sponsored content
 * Get a list of spocs based on region and pocket_id. The IP address is used to deduce a rough geographic region, for example "Texas" in the U.S. or "England" in the U.K. The IP is not stored or shared to preserve privacy.
 */
declare const getSpocs: <ThrowOnError extends boolean = false>(options: Options<GetSpocsData, ThrowOnError>) => RequestResult<GetSpocsResponses, unknown, ThrowOnError, "fields">;
/**
 * (legacy) Delete a user's personal data
 * Used when a user opts-out of sponsored content to delete the user's data.
 */
declare const deleteUser: <ThrowOnError extends boolean = false>(options: Options<DeleteUserData, ThrowOnError>) => RequestResult<DeleteUserResponses, unknown, ThrowOnError, "fields">;
/**
 * (legacy) Get tiles
 */
declare const getTiles: <ThrowOnError extends boolean = false>(options?: Options<GetTilesData, ThrowOnError>) => RequestResult<GetTilesResponses, GetTilesErrors, ThrowOnError, "fields">;

/**
 * The `createClientConfig()` function will be called on client initialization
 * and the returned object will become the client's initial configuration.
 *
 * You may want to initialize your client this way instead of calling
 * `setConfig()`. This is useful for example if you're using Next.js
 * to ensure your client always has the correct values.
 */
type CreateClientConfig<T extends ClientOptions = ClientOptions$1> = (override?: Config<ClientOptions & T>) => Config<Required<ClientOptions> & T>;
declare const client: Client;

export { type AdCallbacks, type AdContent, type AdFormatBase, type AdPlacement, type AdRequest, type AdResponse, type Attributions, type Caps, type ClientOptions$1 as ClientOptions, type Consent, type CreateClientConfig, type DeleteUserData, type DeleteUserResponses, type DeleteV1DeleteUserData, type DeleteV1DeleteUserResponses, type DomainAffinityParameterSet, type FeatureFlags, type GetAdsData, type GetAdsErrors, type GetAdsResponse, type GetAdsResponses, type GetSpocsData, type GetSpocsResponse, type GetSpocsResponses, type GetTilesData, type GetTilesErrors, type GetTilesResponse, type GetTilesResponses, type GetV1ImagesData, type GetV1ImagesResponses, type GetV1LogData, type GetV1LogErrors, type GetV1LogResponses, type GetV1tData, type GetV1tResponses, type ImageAd, type Options, type Placement, type Settings, type Shim, type Spoc, type SpocFeed, type SpocFeedItem, type SpocFrequencyCaps, type SpocRanking, type SpocRequest, type Task, type TelemetryResponse, type Tile, type TimeSegment, type UaTile, client, deleteUser, deleteV1DeleteUser, getAds, getSpocs, getTiles, getV1Images, getV1Log, getV1T };
