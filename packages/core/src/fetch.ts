import { client, getAds, AdPlacement, AdResponse } from '@heyapi'
import { AdUnitFormatTypeLookup, DEFAULT_SERVICE_ENDPOINT } from './constants'
import { DefaultLogger } from './logger'
import { getOrGenerateContextId } from './store'
import { MozAdsPlacements, MozAdsPlacementWithContent } from './types'
import { fallbackAdContentLookup, getFallbackAds, getFallbackSquareDefault } from './fallback'

const logger = new DefaultLogger({ name: 'core.fetch' })

export class FetchAdsError extends Error {
  override name = 'FetchAdsError'
  constructor(
    public cause: Error,
  ) {
    super(cause.message, { cause })
  }
}

export interface FetchAdsParams {
  placements: MozAdsPlacements
  contextId?: string
  serviceEndpoint?: string
}

let pendingPlacements: MozAdsPlacements = {}
let fetchPromise: Promise<MozAdsPlacements> | undefined

export const fetchAds = async ({
  placements,
  contextId = getOrGenerateContextId(),
  serviceEndpoint = DEFAULT_SERVICE_ENDPOINT,
}: FetchAdsParams): Promise<MozAdsPlacements> => {
  // Add these placements to a pending queue to be fetched
  pendingPlacements = {
    ...pendingPlacements,
    ...placements,
  }

  // Return the existing promise if we're already waiting to fetch a batch of placements
  if (fetchPromise) {
    return fetchPromise
  }

  // Otherwise, create a new promise to be resolved after a batch of placements are fetched
  fetchPromise = new Promise((resolve, reject) => {
    // Wait one tick of the run loop before fetching the current batch of placements
    setTimeout(async () => {
      client.setConfig(
        {
          baseUrl: serviceEndpoint,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      const request = {
        body: {
          context_id: contextId,
          placements: buildPlacementsRequest(pendingPlacements),
        },
      }
      try {
        const { data: response, error } = await getAds(request)
        if (error || !response) {
          const fetchAdsError = new FetchAdsError(new Error(`getAds failed with response: ${response}. Error: ${error}`))
          logger.error(fetchAdsError.message, {
            type: 'fetchAds.request.error',
            eventLabel: 'fetch_error',
            method: 'POST',
            errorId: `${fetchAdsError.name}`,
          })
          throw fetchAdsError
        }

        logger.info(`Successfully fetched ads with request: ${JSON.stringify(request)}`, {
          type: 'fetchAds.request.success',
          method: 'POST',
        })

        resolve(mapResponseToPlacementsWithContent(response, pendingPlacements))
      }
      catch (error: unknown) {
        const fetchAdsError = new FetchAdsError(error as Error)
        logger.error(fetchAdsError.message, {
          type: 'fetchAds.request.error',
          eventLabel: 'fetch_error',
          method: 'POST',
          errorId: `${fetchAdsError.name}`,
        })
        // Try to render hardcoded fallback Ads
        try {
          const fallbackResponse = mapResponseToPlacementsWithContent(getFallbackAds(pendingPlacements), pendingPlacements)
          resolve(fallbackResponse)
        }
        // Reject if fallback fails
        catch {
          reject(fetchAdsError)
        }
      }
      finally {
        // Reset our state so that future requests for placements will be fetched in their own batch
        pendingPlacements = {}
        fetchPromise = undefined
      }
    })
  })

  return fetchPromise
}

export function buildPlacementsRequest(placements: MozAdsPlacements): AdPlacement[] {
  return Object.values(placements).map((placementConfig) => {
    let content
    if (placementConfig.iabContent) {
      content = {
        taxonomy: placementConfig.iabContent.taxonomy,
        categories: placementConfig.iabContent.categoryIds,
      }
    }

    const adPlacement = {
      placement: placementConfig.placementId,
      count: 1, // Each placement should be unique and result in only one ad returned
      content,
    }

    return adPlacement
  })
}

/**
 * Maps the ad content from the UAPI response to corresponding placement IDs of given configs.
 *
 * Note: This function will attempt to use fallback ads where possible if not all content is mapped.
 */
export function mapResponseToPlacementsWithContent(response: AdResponse, placements: MozAdsPlacements): MozAdsPlacements {
  for (const placementWithContent of Object.values<MozAdsPlacementWithContent>(placements)) {
    const placementId = placementWithContent.placementId
    const contentFromServer = response[placementId]?.[0]
    if (!contentFromServer) {
      // If a single ad placement is missing from the response, we fill that slot if a single fallback if able

      if (!placementWithContent.fixedSize) {
        // Without a fixedSize, we cannot fallback to anything, so we give it an empty object
        placementWithContent.content = {}
        continue
      }
      const fallbackContentType = AdUnitFormatTypeLookup[`${placementWithContent?.fixedSize.width}x${placementWithContent?.fixedSize.height}`]
      const fallbackContent = fallbackAdContentLookup[fallbackContentType] ?? getFallbackSquareDefault()
      placementWithContent.content = fallbackContent
      continue
    }
    placementWithContent.content = contentFromServer
  }
  return placements
}
