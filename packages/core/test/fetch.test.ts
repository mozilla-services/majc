/* eslint @stylistic/quote-props: 0 */

import * as heyapi from "@heyapi"
import * as fallback from "../src/fallback"
import { mockGetAdsPartialResponse, mockGetAdsResponse } from "./mocks/mockGetAdsResponse"
import { buildPlacementsRequest, fetchAds, FetchAdsError, FetchAdsParams } from "../src/fetch"
import { MozAdsPlacements, MozAdsPlacementWithContent } from "../src/types"
import { tick } from "@/jest.setup"
import { IABFixedSize } from "@core/constants"

jest.mock("@heyapi", () => {
  return {
    __esModule: true,
    ...jest.requireActual("@heyapi"),
  }
})

describe("core/fetch.ts", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const placements: MozAdsPlacements = {
    "pocket_billboard_1": {
      placementId: "pocket_billboard_1",
    },
    "pocket_skyscraper_1": {
      placementId: "pocket_skyscraper_1",
      iabContent: {
        taxonomy: "IAB-1.0",
        categoryIds: ["IAB1-1", "IAB1-2", "IAB2-1"],
      },
    },
    "pocket_skyscraper_2": {
      placementId: "pocket_skyscraper_2",
    },
  }

  const placementsWithFixedSizes: MozAdsPlacements = {
    "pocket_billboard_1": {
      placementId: "pocket_billboard_1",
      fixedSize: IABFixedSize.Billboard,
    },
    "pocket_skyscraper_1": {
      placementId: "pocket_skyscraper_1",
      fixedSize: IABFixedSize.Skyscraper,
      iabContent: {
        taxonomy: "IAB-1.0",
        categoryIds: ["IAB1-1", "IAB1-2", "IAB2-1"],
      },
    },
    "pocket_skyscraper_2": {
      placementId: "pocket_skyscraper_2",
      fixedSize: { width: 100, height: 9000 }, // Non-standard fixedSize
    },
  }

  const contextId = "03267ad1-0074-4aa6-8e0c-ec18e0906bfe"

  const params: FetchAdsParams = {
    serviceEndpoint: "https://if-youre-requesting-this-then-the-mock-is-broken",
    contextId,
    placements,
  }

  const paramsWithFixedSizes: FetchAdsParams = {
    serviceEndpoint: "https://if-youre-requesting-this-then-the-mock-is-broken",
    contextId,
    placements: placementsWithFixedSizes,
  }

  const request = {
    body: {
      context_id: contextId,
      placements: buildPlacementsRequest(params.placements),
    },
  }

  const requestWithFixedSizes = {
    body: {
      context_id: contextId,
      placements: buildPlacementsRequest(paramsWithFixedSizes.placements),
    },
  }

  test("buildPlacementsRequest returns an array of placements in the correct format", () => {
    const adPlacements = buildPlacementsRequest(params.placements)
    expect(adPlacements.length).toBe(3)

    expect(adPlacements.find(el => el.placement === "pocket_billboard_1")?.count).toBe(1)
    expect(adPlacements.find(el => el.placement === "pocket_billboard_1")?.content).toBeUndefined()

    expect(adPlacements.find(el => el.placement === "pocket_skyscraper_1")?.count).toBe(1)
    expect(adPlacements.find(el => el.placement === "pocket_skyscraper_1")?.content).toBeDefined()
    expect(adPlacements.find(el => el.placement === "pocket_skyscraper_1")?.content?.taxonomy).toBe("IAB-1.0")
    expect(adPlacements.find(el => el.placement === "pocket_skyscraper_1")?.content?.categories?.length).toBe(3)

    expect(adPlacements.find(el => el.placement === "pocket_skyscraper_2")?.count).toBe(1)
    expect(adPlacements.find(el => el.placement === "pocket_skyscraper_2")?.content).toBeUndefined()
  })

  test("fetchAds with successful response", async () => {
    // @ts-expect-error Jest types create difficult to resolve union for test code
    const getAdsMock = jest.spyOn(heyapi, "getAds").mockResolvedValueOnce({ data: mockGetAdsResponse })
    const placementsWithContent = await fetchAds(params)
    await expect(placementsWithContent).resolves
    expect(getAdsMock).toHaveBeenCalledWith(request)
    expect(Object.values(placementsWithContent).length).toBe(3)

    const billboard1Placements = Object.values(placementsWithContent).filter(el => el.placementId === "pocket_billboard_1")
    expect(billboard1Placements.length).toBe(1)
    expect((billboard1Placements[0] as MozAdsPlacementWithContent).content).toEqual(mockGetAdsResponse["pocket_billboard_1"][0])

    const skyScraper1Placements = Object.values(placementsWithContent).filter(el => el.placementId === "pocket_skyscraper_1")
    expect(skyScraper1Placements.length).toBe(1)
    expect((skyScraper1Placements[0] as MozAdsPlacementWithContent).content).toEqual(mockGetAdsResponse["pocket_skyscraper_1"][0])

    const skyScraper2Placements = Object.values(placementsWithContent).filter(el => el.placementId === "pocket_skyscraper_2")
    expect(skyScraper2Placements.length).toBe(1)
    expect((skyScraper2Placements[0] as MozAdsPlacementWithContent).content).toEqual(mockGetAdsResponse["pocket_skyscraper_2"][0])
  })

  test("fetchAds with successful partial response without fixed size", async () => {
    // @ts-expect-error Jest types create difficult to resolve union for test code
    const getAdsMock = jest.spyOn(heyapi, "getAds").mockResolvedValueOnce({ data: mockGetAdsPartialResponse })
    const placementsWithContent = await fetchAds(params)
    await expect(placementsWithContent).resolves
    expect(getAdsMock).toHaveBeenCalledWith(request)
    expect(Object.values(placementsWithContent).length).toBe(3)

    const billboard1Placements = Object.values(placementsWithContent).filter(el => el.placementId === "pocket_billboard_1")
    expect(billboard1Placements.length).toBe(1)
    expect((billboard1Placements[0] as MozAdsPlacementWithContent).content).toEqual(mockGetAdsResponse["pocket_billboard_1"][0])

    const skyScraper1Placements = Object.values(placementsWithContent).filter(el => el.placementId === "pocket_skyscraper_1")
    expect(skyScraper1Placements.length).toBe(1)
    expect((skyScraper1Placements[0] as MozAdsPlacementWithContent).content).toEqual({})

    const skyScraper2Placements = Object.values(placementsWithContent).filter(el => el.placementId === "pocket_skyscraper_2")
    expect(skyScraper2Placements.length).toBe(1)
    expect((skyScraper2Placements[0] as MozAdsPlacementWithContent).content).toEqual({})
  })

  test("fetchAds with successful partial response with fixed size", async () => {
    // @ts-expect-error Jest types create difficult to resolve union for test code
    const getAdsMock = jest.spyOn(heyapi, "getAds").mockResolvedValueOnce({ data: mockGetAdsPartialResponse })
    const placementsWithContent = await fetchAds(paramsWithFixedSizes)
    await expect(placementsWithContent).resolves
    expect(getAdsMock).toHaveBeenCalledWith(requestWithFixedSizes)
    expect(Object.values(placementsWithContent).length).toBe(3)

    const billboard1Placements = Object.values(placementsWithContent).filter(el => el.placementId === "pocket_billboard_1")
    expect(billboard1Placements.length).toBe(1)
    expect((billboard1Placements[0] as MozAdsPlacementWithContent).content).toEqual(mockGetAdsResponse["pocket_billboard_1"][0])

    const skyScraper1Placements = Object.values(placementsWithContent).filter(el => el.placementId === "pocket_skyscraper_1")
    expect(skyScraper1Placements.length).toBe(1)
    expect((skyScraper1Placements[0] as MozAdsPlacementWithContent).content).toEqual(fallback.getFallbackSkyscraper())

    const skyScraper2Placements = Object.values(placementsWithContent).filter(el => el.placementId === "pocket_skyscraper_2")
    expect(skyScraper2Placements.length).toBe(1)
    expect((skyScraper2Placements[0] as MozAdsPlacementWithContent).content).toEqual(fallback.getFallbackSquareDefault())
  })

  test("fetchAds with error response", async () => {
    const getAdsMock = jest.spyOn(heyapi, "getAds").mockRejectedValueOnce(new Error("test-error"))
    const getFallbackAdsMock = jest.spyOn(fallback, "getFallbackAds")
    const consoleErrorMock = jest.spyOn(globalThis.console, "error")
    const placementsWithContent = await fetchAds(params)
    // Fallback should still resolve on error
    await expect(placementsWithContent).resolves
    expect(getAdsMock).toHaveBeenCalledWith(request)
    expect(getFallbackAdsMock).toHaveBeenCalledTimes(1)
    expect(consoleErrorMock).toHaveBeenCalledWith("test-error")
  })

  test("fetchAds with error response and failed fallback", async () => {
    const getAdsMock = jest.spyOn(heyapi, "getAds").mockRejectedValueOnce(new Error("test-error"))
    const getFallbackAdsMock = jest.spyOn(fallback, "getFallbackAds").mockImplementationOnce(() => {
      throw new Error("test-error")
    })
    const consoleErrorMock = jest.spyOn(globalThis.console, "error")
    const placementsWithContent = fetchAds(params)
    // Fallback should still resolve on error
    await expect(placementsWithContent).rejects.toThrow(FetchAdsError)
    expect(getAdsMock).toHaveBeenCalledWith(request)
    expect(getFallbackAdsMock).toHaveBeenCalledTimes(1)
    expect(consoleErrorMock).toHaveBeenCalledWith("test-error")
  })

  test("fetchAds with invalid response", async () => {
    // @ts-expect-error Jest types create difficult to resolve union for test code
    const getAdsMock = jest.spyOn(heyapi, "getAds").mockResolvedValueOnce({})
    const getFallbackAdsMock = jest.spyOn(fallback, "getFallbackAds")
    const consoleErrorMock = jest.spyOn(globalThis.console, "error")
    const placementsWithContent = await fetchAds(params)
    // Fallback should still resolve on invalid response
    await expect(placementsWithContent).resolves
    expect(getAdsMock).toHaveBeenCalledWith(request)
    expect(getFallbackAdsMock).toHaveBeenCalledTimes(1)
    expect(consoleErrorMock).toHaveBeenCalledWith("getAds failed with response: undefined. Error: undefined")
  })

  test("fetchAds with invalid response and fallback failure", async () => {
    // @ts-expect-error Jest types create difficult to resolve union for test code
    const getAdsMock = jest.spyOn(heyapi, "getAds").mockResolvedValueOnce({})
    const getFallbackAdsMock = jest.spyOn(fallback, "getFallbackAds").mockImplementationOnce(() => {
      throw new Error("Something went wrong")
    })
    const consoleErrorMock = jest.spyOn(globalThis.console, "error")
    const placementsWithContent = fetchAds(params)
    // Fallback should still resolve on invalid response
    await expect(placementsWithContent).rejects.toThrow(FetchAdsError)
    expect(getAdsMock).toHaveBeenCalledWith(request)
    expect(getFallbackAdsMock).toHaveBeenCalledTimes(1)
    expect(consoleErrorMock).toHaveBeenCalledWith("getAds failed with response: undefined. Error: undefined")
  })

  test("multiple subsequent calls to fetchAds in each tick of the run loop are batched", async () => {
    // @ts-expect-error Jest types create difficult to resolve union for test code
    const getAdsMock = jest.spyOn(heyapi, "getAds").mockResolvedValueOnce({ data: mockGetAdsResponse })
    fetchAds(params)
    fetchAds(params)
    await tick()
    expect(getAdsMock).toHaveBeenCalledTimes(1)
  })
})
