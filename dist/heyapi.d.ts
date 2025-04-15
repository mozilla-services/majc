import { G as GetAdsData, a as AdResponse, b as GetV1tData, c as GetV1LogData, D as DeleteV1DeleteUserData, d as GetV1ImagesData, e as GetSpocsData, f as Settings, g as SpocFeed, h as DeleteUserData, i as GetTilesData, j as GetTilesResponse, C as ClientOptions$2 } from './types.gen-D4NshL2B.js';
export { s as AdCallbacks, r as AdContent, t as AdFormatBase, A as AdPlacement, q as AdRequest, n as Caps, N as DeleteUserResponses, J as DeleteV1DeleteUserResponses, l as DomainAffinityParameterSet, F as FeatureFlags, x as GetAdsErrors, z as GetAdsResponse, y as GetAdsResponses, M as GetSpocsResponse, L as GetSpocsResponses, O as GetTilesErrors, Q as GetTilesResponses, K as GetV1ImagesResponses, E as GetV1LogErrors, H as GetV1LogResponses, B as GetV1tResponses, I as ImageAd, P as Placement, m as Shim, S as Spoc, o as SpocFeedItem, u as SpocFrequencyCaps, v as SpocRanking, k as SpocRequest, w as TelemetryResponse, p as Tile, T as TimeSegment, U as UaTile } from './types.gen-D4NshL2B.js';

type AuthToken$1 = string | undefined;
interface Auth$1 {
    /**
     * Which part of the request do we use to send the auth?
     *
     * @default 'header'
     */
    in?: 'header' | 'query';
    /**
     * Header or query parameter name.
     *
     * @default 'Authorization'
     */
    name?: string;
    scheme?: 'basic' | 'bearer';
    type: 'apiKey' | 'http';
}
interface SerializerOptions$1<T> {
    /**
     * @default true
     */
    explode: boolean;
    style: T;
}
type ArrayStyle$1 = 'form' | 'spaceDelimited' | 'pipeDelimited';
type ObjectStyle$1 = 'form' | 'deepObject';

type QuerySerializer$1 = (query: Record<string, unknown>) => string;
type BodySerializer$1 = (body: any) => any;
interface QuerySerializerOptions$1 {
    allowReserved?: boolean;
    array?: SerializerOptions$1<ArrayStyle$1>;
    object?: SerializerOptions$1<ObjectStyle$1>;
}

interface Client$1$1<RequestFn = never, Config = unknown, MethodFn = never, BuildUrlFn = never> {
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
interface Config$1$1 {
    /**
     * Auth token or a function returning auth token. The resolved value will be
     * added to the request payload as defined by its `security` array.
     */
    auth?: ((auth: Auth$1) => Promise<AuthToken$1> | AuthToken$1) | AuthToken$1;
    /**
     * A function for serializing request body parameter. By default,
     * {@link JSON.stringify()} will be used.
     */
    bodySerializer?: BodySerializer$1 | null;
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
    querySerializer?: QuerySerializer$1 | QuerySerializerOptions$1;
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

type ErrInterceptor$1<Err, Res, Req, Options> = (error: Err, response: Res, request: Req, options: Options) => Err | Promise<Err>;
type ReqInterceptor$1<Req, Options> = (request: Req, options: Options) => Req | Promise<Req>;
type ResInterceptor$1<Res, Req, Options> = (response: Res, request: Req, options: Options) => Res | Promise<Res>;
declare class Interceptors$1<Interceptor> {
    _fns: Interceptor[];
    constructor();
    clear(): void;
    exists(fn: Interceptor): boolean;
    eject(fn: Interceptor): void;
    use(fn: Interceptor): void;
}
interface Middleware$1<Req, Res, Err, Options> {
    error: Pick<Interceptors$1<ErrInterceptor$1<Err, Res, Req, Options>>, 'eject' | 'use'>;
    request: Pick<Interceptors$1<ReqInterceptor$1<Req, Options>>, 'eject' | 'use'>;
    response: Pick<Interceptors$1<ResInterceptor$1<Res, Req, Options>>, 'eject' | 'use'>;
}

interface Config$2<T extends ClientOptions$1 = ClientOptions$1> extends Omit<RequestInit, 'body' | 'headers' | 'method'>, Config$1$1 {
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
     * Return the response data parsed in a specified format. By default, `auto`
     * will infer the appropriate method from the `Content-Type` response header.
     * You can override this behavior with any of the {@link Body} methods.
     * Select `stream` if you don't want to parse response data at all.
     *
     * @default 'auto'
     */
    parseAs?: Exclude<keyof Body, 'body' | 'bodyUsed'> | 'auto' | 'stream';
    /**
     * Throw an error instead of returning it in the response?
     *
     * @default false
     */
    throwOnError?: T['throwOnError'];
}
interface RequestOptions$1<ThrowOnError extends boolean = boolean, Url extends string = string> extends Config$2<{
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
    security?: ReadonlyArray<Auth$1>;
    url: Url;
}
type RequestResult$1<TData = unknown, TError = unknown, ThrowOnError extends boolean = boolean> = ThrowOnError extends true ? Promise<{
    data: TData;
    request: Request;
    response: Response;
}> : Promise<({
    data: TData;
    error: undefined;
} | {
    data: undefined;
    error: TError;
}) & {
    request: Request;
    response: Response;
}>;
interface ClientOptions$1 {
    baseUrl?: string;
    throwOnError?: boolean;
}
type MethodFn$1 = <TData = unknown, TError = unknown, ThrowOnError extends boolean = false>(options: Omit<RequestOptions$1<ThrowOnError>, 'method'>) => RequestResult$1<TData, TError, ThrowOnError>;
type RequestFn$1 = <TData = unknown, TError = unknown, ThrowOnError extends boolean = false>(options: Omit<RequestOptions$1<ThrowOnError>, 'method'> & Pick<Required<RequestOptions$1<ThrowOnError>>, 'method'>) => RequestResult$1<TData, TError, ThrowOnError>;
type BuildUrlFn$1 = <TData extends {
    body?: unknown;
    path?: Record<string, unknown>;
    query?: Record<string, unknown>;
    url: string;
}>(options: Pick<TData, 'url'> & Options$2<TData>) => string;
type Client$2 = Client$1$1<RequestFn$1, Config$2, MethodFn$1, BuildUrlFn$1> & {
    interceptors: Middleware$1<Request, Response, unknown, RequestOptions$1>;
};
interface TDataShape$1 {
    body?: unknown;
    headers?: unknown;
    path?: unknown;
    query?: unknown;
    url: string;
}
type OmitKeys$1<T, K> = Pick<T, Exclude<keyof T, K>>;
type Options$2<TData extends TDataShape$1 = TDataShape$1, ThrowOnError extends boolean = boolean> = OmitKeys$1<RequestOptions$1<ThrowOnError>, 'body' | 'path' | 'query' | 'url'> & Omit<TData, 'url'>;

type AuthToken = string | undefined;
interface Auth {
    /**
     * Which part of the request do we use to send the auth?
     *
     * @default 'header'
     */
    in?: 'header' | 'query';
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
    _fns: Interceptor[];
    constructor();
    clear(): void;
    exists(fn: Interceptor): boolean;
    eject(fn: Interceptor): void;
    use(fn: Interceptor): void;
}
interface Middleware<Req, Res, Err, Options> {
    error: Pick<Interceptors<ErrInterceptor<Err, Res, Req, Options>>, 'eject' | 'use'>;
    request: Pick<Interceptors<ReqInterceptor<Req, Options>>, 'eject' | 'use'>;
    response: Pick<Interceptors<ResInterceptor<Res, Req, Options>>, 'eject' | 'use'>;
}

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
     * Return the response data parsed in a specified format. By default, `auto`
     * will infer the appropriate method from the `Content-Type` response header.
     * You can override this behavior with any of the {@link Body} methods.
     * Select `stream` if you don't want to parse response data at all.
     *
     * @default 'auto'
     */
    parseAs?: Exclude<keyof Body, 'body' | 'bodyUsed'> | 'auto' | 'stream';
    /**
     * Throw an error instead of returning it in the response?
     *
     * @default false
     */
    throwOnError?: T['throwOnError'];
}
interface RequestOptions<ThrowOnError extends boolean = boolean, Url extends string = string> extends Config<{
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
type RequestResult<TData = unknown, TError = unknown, ThrowOnError extends boolean = boolean> = ThrowOnError extends true ? Promise<{
    data: TData;
    request: Request;
    response: Response;
}> : Promise<({
    data: TData;
    error: undefined;
} | {
    data: undefined;
    error: TError;
}) & {
    request: Request;
    response: Response;
}>;
interface ClientOptions {
    baseUrl?: string;
    throwOnError?: boolean;
}
type MethodFn = <TData = unknown, TError = unknown, ThrowOnError extends boolean = false>(options: Omit<RequestOptions<ThrowOnError>, 'method'>) => RequestResult<TData, TError, ThrowOnError>;
type RequestFn = <TData = unknown, TError = unknown, ThrowOnError extends boolean = false>(options: Omit<RequestOptions<ThrowOnError>, 'method'> & Pick<Required<RequestOptions<ThrowOnError>>, 'method'>) => RequestResult<TData, TError, ThrowOnError>;
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
type Options$1<TData extends TDataShape = TDataShape, ThrowOnError extends boolean = boolean> = OmitKeys<RequestOptions<ThrowOnError>, 'body' | 'path' | 'query' | 'url'> & Omit<TData, 'url'>;

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
declare const getAds: <ThrowOnError extends boolean = false>(options: Options<GetAdsData, ThrowOnError>) => RequestResult$1<AdResponse, unknown, ThrowOnError>;
/**
 * Report ad interaction
 * Interaction callback URLs are returned in an ad response. When the corresponding action on the client occurs, those URLs should be fetched.
 */
declare const getV1T: <ThrowOnError extends boolean = false>(options: Options<GetV1tData, ThrowOnError>) => RequestResult$1<unknown, unknown, ThrowOnError>;
/**
 * Record client events
 * This endpoint can be used to persist a prometheus metric.
 */
declare const getV1Log: <ThrowOnError extends boolean = false>(options?: Options<GetV1LogData, ThrowOnError>) => RequestResult$1<unknown, unknown, ThrowOnError>;
/**
 * Delete user data
 * Delete any data persisted associated with a given context_id.
 */
declare const deleteV1DeleteUser: <ThrowOnError extends boolean = false>(options: Options<DeleteV1DeleteUserData, ThrowOnError>) => RequestResult$1<unknown, unknown, ThrowOnError>;
/**
 * Get ad image
 * Proxies an ad image from an encoded URL. Encoded image URLs are returned in an ad response, calls to this endpoint shouldn't be constructed manually.
 */
declare const getV1Images: <ThrowOnError extends boolean = false>(options: Options<GetV1ImagesData, ThrowOnError>) => RequestResult$1<unknown, unknown, ThrowOnError>;
/**
 * (legacy) Get sponsored content
 * Get a list of spocs based on region and pocket_id. The IP address is used to deduce a rough geographic region, for example "Texas" in the U.S. or "England" in the U.K. The IP is not stored or shared to preserve privacy.
 */
declare const getSpocs: <ThrowOnError extends boolean = false>(options: Options<GetSpocsData, ThrowOnError>) => RequestResult$1<{
    [key: string]: Settings | SpocFeed | {
        [key: string]: unknown;
    } | undefined;
    settings?: Settings;
    __debug__?: {
        [key: string]: unknown;
    };
}, unknown, ThrowOnError>;
/**
 * (legacy) Delete a user's personal data
 * Used when a user opts-out of sponsored content to delete the user's data.
 */
declare const deleteUser: <ThrowOnError extends boolean = false>(options: Options<DeleteUserData, ThrowOnError>) => RequestResult$1<unknown, unknown, ThrowOnError>;
/**
 * (legacy) Get tiles
 */
declare const getTiles: <ThrowOnError extends boolean = false>(options?: Options<GetTilesData, ThrowOnError>) => RequestResult$1<GetTilesResponse, unknown, ThrowOnError>;

/**
 * The `createClientConfig()` function will be called on client initialization
 * and the returned object will become the client's initial configuration.
 *
 * You may want to initialize your client this way instead of calling
 * `setConfig()`. This is useful for example if you're using Next.js
 * to ensure your client always has the correct values.
 */
type CreateClientConfig<T extends ClientOptions$1 = ClientOptions$2> = (override?: Config$2<ClientOptions$1 & T>) => Config$2<Required<ClientOptions$1> & T>;
declare const client: Client$2;

export { AdResponse, ClientOptions$2 as ClientOptions, type CreateClientConfig, DeleteUserData, DeleteV1DeleteUserData, GetAdsData, GetSpocsData, GetTilesData, GetTilesResponse, GetV1ImagesData, GetV1LogData, GetV1tData, type Options, Settings, SpocFeed, client, deleteUser, deleteV1DeleteUser, getAds, getSpocs, getTiles, getV1Images, getV1Log, getV1T };
