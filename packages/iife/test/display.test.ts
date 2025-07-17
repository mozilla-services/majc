/* eslint @stylistic/quote-props: 0 */

import fetchMock from "jest-fetch-mock"
import { tick } from "@/jest.setup"
import { renderPlacement } from "../src/display"

import * as innerFallback from "../../core/src/fallback"
import * as coreFallback from "@core/fallback"
import { MockImage } from "../../core/test/mocks/mockImage"
import { MozAdsPlacementConfig } from "@core/types"
import { FixedSize } from "@core/constants"

jest.mock("@core/fallback", () => {
  return {
    __esModule: true,
    ...jest.requireActual("@core/fallback"),
    getFallbackAd: jest.fn(),
  }
})

describe("iife/display.ts", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test("renderPlacement logs an error and fails when an invalid element ID is passed", async () => {
    const placementConfig = {
      placementId: "pocket_billboard_1",
    }
    const consoleErrorMock = jest.spyOn(globalThis.console, "error")

    await renderPlacement("invalid-element-id", placementConfig)
    await tick()
    expect(consoleErrorMock).toHaveBeenLastCalledWith("Unable to render placement; No element found with ID invalid-element-id")
  })

  test("renderPlacement logs an error and fails when an invalid element is passed", async () => {
    const placementConfig = {
      placementId: "pocket_billboard_2",
    }
    const consoleErrorMock = jest.spyOn(globalThis.console, "error")

    await renderPlacement(undefined as unknown as HTMLElement, placementConfig)
    await tick()
    expect(consoleErrorMock).toHaveBeenLastCalledWith("Unable to render placement; Invalid element")
  })

  test("renderPlacement calls fallbacks on fetch error", async () => {
    const placementElement = document.createElement("div")
    const placementConfig = {
      placementId: "pocket_billboard_3",
      iabContentCategoryIds: ["IAB1"],
    }
    fetchMock.mockRejectOnce(new Error("test-error"))
    const fallbackSpy = jest.spyOn(innerFallback, "getFallbackAds")

    await renderPlacement(placementElement, placementConfig)
    await tick()
    expect(fallbackSpy).toHaveBeenCalledTimes(1)
  })

  test("renderPlacement throws an error when the fetch and fallback fails", async () => {
    const placementElement = document.createElement("div")
    const placementConfig = {
      placementId: "pocket_billboard_4",
    }
    const consoleErrorMock = jest.spyOn(globalThis.console, "error")
    fetchMock.mockRejectOnce(new Error("test-error"))
    jest.spyOn(innerFallback, "getFallbackAds").mockImplementationOnce(() => {
      throw new Error("test-error")
    })

    await renderPlacement(placementElement, placementConfig)
    await tick()
    expect(consoleErrorMock).toHaveBeenLastCalledWith("Unable to fetch ads; test-error")
  })

  test("renderPlacement produces the correct DOM markup for the requested ad placement", async () => {
    const placementElement = document.createElement("div")
    const placementConfig = {
      placementId: "pocket_billboard_5",
    }
    fetchMock.mockResponseOnce(async () => ({
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "pocket_billboard_5": [
          {
            format: "billboard",
            url: "https://getpocket.com/",
            callbacks: {
              click: "https://example.com/click",
              impression: "https://example.com/impression",
              report: "https://example.com/report",
            },
            image_url: "https://example.com/image",
            alt_text: "Advertiser Name",
            block_key: "1234567890ABCDEFGHabcdefgh",
          },
        ],
      }),
    }))

    await renderPlacement(placementElement, placementConfig)
    await tick()

    const link = placementElement.querySelector<HTMLAnchorElement>(".moz-ads-placement-link[data-placement-id=\"pocket_billboard_5\"]")
    expect(link).toBeInstanceOf(HTMLAnchorElement)
    expect(link?.href).toEqual("https://getpocket.com/")
    const img = link?.querySelector<HTMLImageElement>(".moz-ads-placement-img[data-placement-id=\"pocket_billboard_5\"]")
    expect(img).toBeInstanceOf(HTMLImageElement)
    expect(img?.alt).toEqual("Advertiser Name")
    expect(img?.src).toEqual("https://example.com/image")
    img?.dispatchEvent(new Event("load"))
    const reportButton = link?.querySelector<HTMLButtonElement>(".moz-ads-placement-report-button")
    expect(reportButton).toBeInstanceOf(HTMLButtonElement)
    expect(reportButton?.title).toEqual("Report ad")
    fetchMock.mockResponseOnce(async () => ({}))
    link?.dispatchEvent(new Event("click"))
    expect(fetchMock.mock.lastCall?.[0]).toEqual("https://example.com/click")
    expect(fetchMock.mock.lastCall?.[1]).toEqual({ keepalive: true })
  })

  test("renderPlacement calls fallback on no image url", async () => {
    const placementElement = document.createElement("div")
    const placementConfig: MozAdsPlacementConfig = {
      placementId: "pocket_billboard_6",
      iabContent: {
        taxonomy: "IAB-2.2", categoryIds: [],
      },
      fixedSize: FixedSize.Billboard,
    }
    fetchMock.mockResponseOnce(async () => ({
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "pocket_billboard_6": [
          {
            format: "billboard",
            url: "https://getpocket.com/",
            callbacks: {
              click: "https://example.com/click",
              impression: "https://example.com/impression",
              report: "https://example.com/report",
            },
            alt_text: "Advertiser Name",
            block_key: "1234567890ABCDEFGHabcdefgh",
            // image_url Missing
          },
        ],
      }),
    }))
    const fallbackData = innerFallback.getFallbackBillboard()
    const fallbackSpy = jest.spyOn(coreFallback, "getFallbackAd").mockReturnValueOnce(fallbackData)

    await renderPlacement(placementElement, placementConfig)
    await tick()
    expect(fallbackSpy).toHaveBeenCalledTimes(1)

    const link = placementElement.querySelector<HTMLAnchorElement>(".moz-ads-placement-link[data-placement-id=\"pocket_billboard_6\"]")
    expect(link).toBeInstanceOf(HTMLAnchorElement)
    const img = link?.querySelector<HTMLImageElement>(".moz-ads-placement-img[data-placement-id=\"pocket_billboard_6\"]")
    expect(img).toBeInstanceOf(HTMLImageElement)
    expect(img?.alt).toEqual("Mozilla Ad")
    expect(img?.src).toEqual(fallbackData.image_url)
  })

  test("renderPlacement calls fallback on failure to pre-load load image", async () => {
    const placementElement = document.createElement("div")
    const placementConfig = {
      placementId: "pocket_billboard_7",
      iabContentCategoryIds: ["IAB1"],
    }

    const fallbackData = innerFallback.getFallbackBillboard()
    const fallbackSpy = jest.spyOn(coreFallback, "getFallbackAd").mockReturnValueOnce(fallbackData)
    Object.defineProperty(globalThis, "Image", {
      value: MockImage,
    })

    MockImage.dispatchErrorOnNextLoad()

    await renderPlacement(placementElement, placementConfig)
    await tick()

    expect(fallbackSpy).toHaveBeenCalledTimes(1)
  })
})
