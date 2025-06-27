/* eslint @stylistic/quote-props: 0 */

import fetchMock from "jest-fetch-mock"
import * as react from "react"
import { cleanup, render, waitFor } from "@testing-library/react"
import * as coreFetch from "@core/fetch"
import { MockImage } from "../../../core/test/mocks/mockImage"
import { MozAdsPlacement } from "../../src/components/MozAdsPlacement"
import { tick } from "@/jest.setup"

jest.mock("react", () => {
  return {
    __esModule: true,
    ...jest.requireActual("react"),
  }
})

jest.mock("@core/fetch", () => {
  return {
    __esModule: true,
    ...jest.requireActual("@core/fetch"),
    fetchAds: jest.fn(),
  }
})

describe("react/components/MozAdsPlacement.tsx", () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
    cleanup()
  })

  test("<MozAdsPlacement /> logs an error when an unknown error occurs", async () => {
    jest.spyOn(coreFetch, "fetchAds").mockResolvedValueOnce({
      "pocket_billboard_1": {
        placementId: "pocket_billboard_1",
        content: {
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
      },
    })

    const consoleErrorMock = jest.spyOn(globalThis.console, "error")
    const useLayoutEffectMock = jest.spyOn(react, "useLayoutEffect").mockImplementationOnce(() => {
      throw new Error("test-error")
    })

    const onErrorMock = jest.fn()
    render(
      <MozAdsPlacement placementId="pocket_billboard_1" onError={onErrorMock} />,
    )

    await waitFor(() => {
      expect(useLayoutEffectMock).toHaveBeenCalled()
    })

    expect(consoleErrorMock).toHaveBeenCalledWith("An unexpected error has occured when rendering pocket_billboard_1: test-error")
    expect(onErrorMock).toHaveBeenCalled()
  })

  test("<MozAdsPlacement /> logs an error when the fetch fails", async () => {
    const consoleErrorMock = jest.spyOn(globalThis.console, "error")
    const onErrorMock = jest.fn()

    jest.spyOn(coreFetch, "fetchAds").mockRejectedValueOnce(new Error("test-error"))

    render(
      <MozAdsPlacement placementId="pocket_billboard_2" onError={onErrorMock} />,
    )

    await waitFor(() => {
      expect(consoleErrorMock).toHaveBeenCalledWith("Unable to fetch ads; test-error")
    })

    expect(onErrorMock).toHaveBeenCalled()
  })

  test("<MozAdsPlacement /> calls the onError callback function when the image cannot be loaded", async () => {
    const onErrorMock = jest.fn()

    Object.defineProperty(globalThis, "Image", {
      value: MockImage,
    })

    MockImage.dispatchErrorOnNextLoad()

    jest.spyOn(coreFetch, "fetchAds").mockResolvedValueOnce({
      "pocket_billboard_3": {
        placementId: "pocket_billboard_3",
        content: {
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
      },
    })

    render(
      <MozAdsPlacement placementId="pocket_billboard_3" onError={onErrorMock} />,
    )

    await waitFor(() => {
      expect(onErrorMock).toHaveBeenCalled()
    })
  })

  test("<MozAdsPlacement /> produces the correct DOM markup for the requested ad placement", async () => {
    jest.spyOn(coreFetch, "fetchAds").mockResolvedValueOnce({
      "pocket_billboard_4": {
        placementId: "pocket_billboard_4",
        content: {
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
      },
    })

    const result = render(
      <MozAdsPlacement placementId="pocket_billboard_4" fixedSize={{ width: 100, height: 200 }} />,
    )

    const placementElement = result.baseElement

    await waitFor(() => {
      const link = placementElement.querySelector<HTMLAnchorElement>(".moz-ads-placement-link[data-placement-id=\"pocket_billboard_4\"]")
      expect(link).toBeInstanceOf(HTMLAnchorElement)
    })

    const link = placementElement.querySelector<HTMLAnchorElement>(".moz-ads-placement-link[data-placement-id=\"pocket_billboard_4\"]")
    expect(link).toBeInstanceOf(HTMLAnchorElement)
    const img = link?.querySelector<HTMLImageElement>(".moz-ads-placement-img[data-placement-id=\"pocket_billboard_4\"]")
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

  test("<MozAdsPlacement /> calls the onReport callback function", async () => {
    jest.spyOn(coreFetch, "fetchAds").mockResolvedValueOnce({
      "pocket_billboard_5": {
        placementId: "pocket_billboard_5",
        content: {
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
      },
    })

    const onReportMock = jest.fn()
    const result = render(
      <MozAdsPlacement placementId="pocket_billboard_5" fixedSize={{ width: 100, height: 200 }} onReport={onReportMock} />,
    )

    const placementElement = result.baseElement

    await waitFor(() => {
      const link = placementElement.querySelector<HTMLAnchorElement>(".moz-ads-placement-link[data-placement-id=\"pocket_billboard_5\"]")
      expect(link).toBeInstanceOf(HTMLAnchorElement)
    })

    const link = placementElement.querySelector<HTMLAnchorElement>(".moz-ads-placement-link[data-placement-id=\"pocket_billboard_5\"]")
    expect(link).toBeInstanceOf(HTMLAnchorElement)
    const img = link?.querySelector<HTMLImageElement>(".moz-ads-placement-img[data-placement-id=\"pocket_billboard_5\"]")
    expect(img).toBeInstanceOf(HTMLImageElement)
    expect(img?.alt).toEqual("Advertiser Name")
    expect(img?.src).toEqual("https://example.com/image")
    img?.dispatchEvent(new Event("load"))
    const reportButton = link?.querySelector<HTMLButtonElement>(".moz-ads-placement-report-button")
    expect(reportButton).toBeInstanceOf(HTMLButtonElement)
    expect(reportButton?.title).toEqual("Report ad")
    reportButton?.dispatchEvent(new Event("click"))
    const reportForm = placementElement.querySelector<HTMLFormElement>(".moz-ads-placement-report-form")
    expect(reportForm).toBeInstanceOf(HTMLFormElement)
    const reasonSelect = reportForm?.querySelector<HTMLSelectElement>(".moz-ads-placement-report-reason-select")
    expect(reasonSelect).toBeInstanceOf(HTMLSelectElement)
    reasonSelect!.value = "not_interested"
    reasonSelect?.dispatchEvent(new Event("change"))
    const submitButton = reportForm?.querySelector<HTMLButtonElement>(".moz-ads-placement-report-submit-button")
    expect(submitButton).toBeInstanceOf(HTMLButtonElement)
    fetchMock.mockResponseOnce(async () => ({}))
    reportForm?.dispatchEvent(new Event("submit"))
    expect(fetchMock.mock.lastCall?.[0]).toEqual("https://example.com/report?reason=not_interested")
    expect(fetchMock.mock.lastCall?.[1]).toEqual({ keepalive: true })
    await tick()
    expect(onReportMock).toHaveBeenCalled()
  })
})
