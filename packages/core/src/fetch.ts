import { client, getAds, AdPlacement, AdResponse } from '@heyapi'
import { DEFAULT_SERVICE_ENDPOINT } from './constants'
import { DefaultLogger } from './logger'
import { getOrGenerateContextId } from './store'
import { MozAdsPlacements, MozAdsPlacementWithContent } from './types'

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
          reject(fetchAdsError)
          return
        }

        logger.info(`Succesfully fetched ads with request: ${JSON.stringify(request)}`, {
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
        reject(fetchAdsError)
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
  return Object.values(placements).map(placementConfig => ({
    placement: placementConfig.placementId,
    count: 1, // Each placement should be unique and result in only one ad returned
  }))
}

/**
 * Maps the ad content from the UAPI response to corresponding placement IDs of given configs.
 *
 * Note: This function makes no guarantee that all given placement IDs will have defined `adContent`.
 */
export function mapResponseToPlacementsWithContent(response: AdResponse, placements: MozAdsPlacements): MozAdsPlacements {
  for (const placementWithContent of Object.values<MozAdsPlacementWithContent>(placements)) {
    const placementId = placementWithContent.placementId
    placementWithContent.content = response[placementId]?.[0]
  }
  return placements
}
