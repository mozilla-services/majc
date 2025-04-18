// This file is auto-generated by @hey-api/openapi-ts

import type { Options as ClientOptions, TDataShape, Client } from './client';
import type { GetAdsData, GetAdsResponse, GetV1tData, GetV1LogData, DeleteV1DeleteUserData, GetV1ImagesData, GetSpocsData, GetSpocsResponse, DeleteUserData, GetTilesData, GetTilesResponse } from './types.gen';
import { client as _heyApiClient } from './client.gen';

export type Options<TData extends TDataShape = TDataShape, ThrowOnError extends boolean = boolean> = ClientOptions<TData, ThrowOnError> & {
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
export const getAds = <ThrowOnError extends boolean = false>(options: Options<GetAdsData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).post<GetAdsResponse, unknown, ThrowOnError>({
        url: '/v1/ads',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Report ad interaction
 * Interaction callback URLs are returned in an ad response. When the corresponding action on the client occurs, those URLs should be fetched.
 */
export const getV1T = <ThrowOnError extends boolean = false>(options: Options<GetV1tData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<unknown, unknown, ThrowOnError>({
        url: '/v1/t',
        ...options
    });
};

/**
 * Record client events
 * This endpoint can be used to persist a prometheus metric.
 */
export const getV1Log = <ThrowOnError extends boolean = false>(options?: Options<GetV1LogData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<unknown, unknown, ThrowOnError>({
        url: '/v1/log',
        ...options
    });
};

/**
 * Delete user data
 * Delete any data persisted associated with a given context_id.
 */
export const deleteV1DeleteUser = <ThrowOnError extends boolean = false>(options: Options<DeleteV1DeleteUserData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).delete<unknown, unknown, ThrowOnError>({
        url: '/v1/delete_user',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Get ad image
 * Proxies an ad image from an encoded URL. Encoded image URLs are returned in an ad response, calls to this endpoint shouldn't be constructed manually.
 */
export const getV1Images = <ThrowOnError extends boolean = false>(options: Options<GetV1ImagesData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<unknown, unknown, ThrowOnError>({
        url: '/v1/images',
        ...options
    });
};

/**
 * (legacy) Get sponsored content
 * Get a list of spocs based on region and pocket_id. The IP address is used to deduce a rough geographic region, for example "Texas" in the U.S. or "England" in the U.K. The IP is not stored or shared to preserve privacy.
 */
export const getSpocs = <ThrowOnError extends boolean = false>(options: Options<GetSpocsData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).post<GetSpocsResponse, unknown, ThrowOnError>({
        url: '/spocs',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * (legacy) Delete a user's personal data
 * Used when a user opts-out of sponsored content to delete the user's data.
 */
export const deleteUser = <ThrowOnError extends boolean = false>(options: Options<DeleteUserData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).delete<unknown, unknown, ThrowOnError>({
        url: '/user',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * (legacy) Get tiles
 */
export const getTiles = <ThrowOnError extends boolean = false>(options?: Options<GetTilesData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetTilesResponse, unknown, ThrowOnError>({
        url: '/v1/tiles',
        ...options
    });
};