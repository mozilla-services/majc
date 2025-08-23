/* eslint @stylistic/quote-props: 0 */

import { DefaultLogger } from "../src/logger"
import { FallbackAdURL } from "@core/constants"
import fetchMock from "jest-fetch-mock"
import { tick } from "@/jest.setup"
import { renderPlacement } from "../src/display"
import { MockImage } from "./mocks/mockImage"

describe("core/display.ts", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test("renderPlacement calls the onError callback when the image preload fails", async () => {
    const placementElement = document.createElement("div")
    const placement = {
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
    }

    Object.defineProperty(globalThis, "Image", {
      value: MockImage,
    })

    MockImage.dispatchErrorOnNextLoad()
    const onError = jest.fn()

    renderPlacement(placementElement, {
      placement,
      onError,
    })
    await tick()
    expect(onError).toHaveBeenCalledTimes(1)

    renderPlacement(placementElement, {
      placement,
      onError,
    })
    await tick()
    expect(onError).toHaveBeenCalledTimes(1)

    const img = placementElement.querySelector<HTMLImageElement>(".moz-ads-placement-img[data-placement-id=\"pocket_billboard_1\"]")
    expect(img).toBeInstanceOf(HTMLImageElement)
    img?.dispatchEvent(new Event("error"))
    expect(onError).toHaveBeenCalledTimes(2)
  })

  test("renderPlacement correctly styles the DOM markup when a fixedSize is not specified", async () => {
    const placementElement = document.createElement("div")
    const placement = {
      placementId: "pocket_billboard_1",
      iabContentCategoryIds: ["IAB1"],
      fixedSize: {
        width: undefined as unknown as number,
        height: undefined as unknown as number,
      },
    }

    renderPlacement(placementElement, {
      placement,
    })

    const container = placementElement.querySelector<HTMLDivElement>(".moz-ads-placement-container[data-placement-id=\"pocket_billboard_1\"]")
    expect(container).toBeInstanceOf(HTMLDivElement)
    expect(container?.style.width).toEqual("")
    expect(container?.style.height).toEqual("")
  })

  test("renderPlacement correctly styles the DOM markup when ad content is an empty object", async () => {
    const placementElement = document.createElement("div")
    const placement = {
      placementId: "pocket_billboard_1",
      iabContentCategoryIds: ["IAB1"],
      fixedSize: {
        width: undefined as unknown as number,
        height: undefined as unknown as number,
      },
      content: {},
    }

    renderPlacement(placementElement, {
      placement,
    })

    const container = placementElement.querySelector<HTMLDivElement>(".moz-ads-placement-container[data-placement-id=\"pocket_billboard_1\"]")
    expect(container).toBeInstanceOf(HTMLDivElement)
    expect(container?.style.width).toEqual("")
    expect(container?.style.height).toEqual("")
  })

  test("renderPlacement correctly styles the DOM markup when a fixedSize is specified", async () => {
    const placementElement = document.createElement("div")
    const placement = {
      placementId: "pocket_billboard_1",
      iabContentCategoryIds: ["IAB1"],
      fixedSize: {
        width: 100,
        height: 200,
      },
    }

    renderPlacement(placementElement, {
      placement,
    })

    const container = placementElement.querySelector<HTMLDivElement>(".moz-ads-placement-container[data-placement-id=\"pocket_billboard_1\"]")

    const link = placementElement.querySelector<HTMLAnchorElement>(".moz-ads-placement-link[data-placement-id=\"pocket_billboard_1\"]")
    const img = link?.querySelector<HTMLImageElement>(".moz-ads-placement-img[data-placement-id=\"pocket_billboard_1\"]")
    const reportButton = link?.querySelector<HTMLButtonElement>(".moz-ads-placement-report-button")

    expect(link).toBeFalsy()
    expect(img).toBeFalsy()
    expect(reportButton).toBeFalsy()

    expect(container).toBeInstanceOf(HTMLDivElement)
    expect(container?.style.width).toEqual("100px")
    expect(container?.style.height).toEqual("200px")
  })

  test("renderPlacement produces the correct DOM markup when the \"Report ad\" button is clicked", async () => {
    const placementElement = document.createElement("div")
    const placement = {
      placementId: "pocket_billboard_1",
      iabContentCategoryIds: ["IAB1"],
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
    }

    renderPlacement(placementElement, {
      placement,
    })
    await tick()

    const link = placementElement.querySelector<HTMLAnchorElement>(".moz-ads-placement-link[data-placement-id=\"pocket_billboard_1\"]")
    expect(link).toBeInstanceOf(HTMLAnchorElement)
    expect(link?.href).toEqual("https://getpocket.com/")
    const img = link?.querySelector<HTMLImageElement>(".moz-ads-placement-img[data-placement-id=\"pocket_billboard_1\"]")
    expect(img).toBeInstanceOf(HTMLImageElement)
    expect(img?.alt).toEqual("Billboard Ad 1: Advertiser Name")
    expect(img?.src).toEqual("https://example.com/image")
    const reportButton = link?.querySelector<HTMLButtonElement>(".moz-ads-placement-report-button")
    expect(reportButton).toBeInstanceOf(HTMLButtonElement)
    expect(reportButton?.title).toEqual("Report ad")
    reportButton?.dispatchEvent(new MouseEvent("click"))
    const inner = placementElement.querySelector<HTMLDivElement>(".moz-ads-placement-inner")
    expect(inner).toBeInstanceOf(HTMLDivElement)
    const reportForm = inner?.querySelector<HTMLFormElement>(".moz-ads-placement-report-form")
    expect(reportForm).toBeInstanceOf(HTMLFormElement)
    const reportSubmitButton = reportForm?.querySelector<HTMLButtonElement>(".moz-ads-placement-report-submit-button")
    expect(reportSubmitButton).toBeInstanceOf(HTMLButtonElement)
    const reportSelect = reportForm?.querySelector<HTMLSelectElement>(".moz-ads-placement-report-reason-select")
    expect(reportSelect).toBeInstanceOf(HTMLSelectElement)
  })

  test("renderPlacement produces the correct DOM markup when the \"Close\" button in the \"Report ad\" form is clicked", async () => {
    const placementElement = document.createElement("div")
    const placement = {
      placementId: "pocket_billboard_1",
      iabContentCategoryIds: ["IAB1"],
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
    }

    renderPlacement(placementElement, {
      placement,
    })
    await tick()

    const link = placementElement.querySelector<HTMLAnchorElement>(".moz-ads-placement-link[data-placement-id=\"pocket_billboard_1\"]")
    expect(link).toBeInstanceOf(HTMLAnchorElement)
    expect(link?.href).toEqual("https://getpocket.com/")
    const img = link?.querySelector<HTMLImageElement>(".moz-ads-placement-img[data-placement-id=\"pocket_billboard_1\"]")
    expect(img).toBeInstanceOf(HTMLImageElement)
    expect(img?.alt).toEqual("Billboard Ad 1: Advertiser Name")
    expect(img?.src).toEqual("https://example.com/image")
    const reportButton = link?.querySelector<HTMLButtonElement>(".moz-ads-placement-report-button")
    expect(reportButton).toBeInstanceOf(HTMLButtonElement)
    expect(reportButton?.title).toEqual("Report ad")
    reportButton?.dispatchEvent(new MouseEvent("click"))
    const inner = placementElement.querySelector<HTMLDivElement>(".moz-ads-placement-inner")
    expect(inner).toBeInstanceOf(HTMLDivElement)
    const reportForm = inner?.querySelector<HTMLFormElement>(".moz-ads-placement-report-form")
    expect(reportForm).toBeInstanceOf(HTMLFormElement)
    const reportCloseButton = reportForm?.querySelector<HTMLButtonElement>(".moz-ads-placement-report-close-button")
    expect(reportCloseButton).toBeInstanceOf(HTMLButtonElement)
    reportCloseButton?.dispatchEvent(new MouseEvent("click"))
    await tick()
    const inner2 = placementElement.querySelector<HTMLDivElement>(".moz-ads-placement-inner")
    expect(inner2).toBeInstanceOf(HTMLDivElement)
    const reportForm2 = inner2?.querySelector<HTMLFormElement>(".moz-ads-placement-report-form")
    expect(reportForm2).toBeNull()
  })

  test("renderPlacement produces the correct DOM markup when the \"Report ad\" form is submitted", async () => {
    const placementElement = document.createElement("div")
    const placement = {
      placementId: "pocket_billboard_1",
      iabContentCategoryIds: ["IAB1"],
      content: {
        format: "billboard",
        callbacks: {
          click: "https://example.com/click",
          impression: "https://example.com/impression",
          report: "https://example.com/report",
        },
        image_url: "https://example.com/image",
        block_key: "1234567890ABCDEFGHabcdefgh",
      },
    }

    const onReport = jest.fn()

    renderPlacement(placementElement, {
      placement,
      onReport,
    })
    await tick()

    const link = placementElement.querySelector<HTMLAnchorElement>(".moz-ads-placement-link[data-placement-id=\"pocket_billboard_1\"]")
    expect(link).toBeInstanceOf(HTMLAnchorElement)
    expect(link?.href).toEqual("about:blank")
    const img = link?.querySelector<HTMLImageElement>(".moz-ads-placement-img[data-placement-id=\"pocket_billboard_1\"]")
    expect(img).toBeInstanceOf(HTMLImageElement)
    expect(img?.alt).toEqual("Billboard Ad 1")
    const reportButton = placementElement.querySelector<HTMLButtonElement>(".moz-ads-placement-report-button")
    expect(reportButton).toBeInstanceOf(HTMLButtonElement)
    expect(reportButton?.title).toEqual("Report ad")
    reportButton?.dispatchEvent(new MouseEvent("click"))
    const inner = placementElement.querySelector<HTMLDivElement>(".moz-ads-placement-inner")
    expect(inner).toBeInstanceOf(HTMLDivElement)
    const reportForm = inner?.querySelector<HTMLFormElement>(".moz-ads-placement-report-form")
    expect(reportForm).toBeInstanceOf(HTMLFormElement)
    const reportSubmitButton = reportForm?.querySelector<HTMLButtonElement>(".moz-ads-placement-report-submit-button")
    expect(reportSubmitButton).toBeInstanceOf(HTMLButtonElement)
    expect(reportSubmitButton?.disabled).toBeTruthy()
    const reportSelect = reportForm?.querySelector<HTMLSelectElement>(".moz-ads-placement-report-reason-select")
    expect(reportSelect).toBeInstanceOf(HTMLSelectElement)
    reportSelect!.value = "not_interested"
    reportSelect?.dispatchEvent(new Event("change"))
    expect(reportSubmitButton?.disabled).toBeFalsy()
    fetchMock.mockResponse(async () => ({}))
    reportForm?.dispatchEvent(new Event("submit"))
    await tick()
    expect(fetchMock.mock.lastCall?.[0]).toEqual("https://example.com/report?reason=not_interested")
    expect(fetchMock.mock.lastCall?.[1]).toEqual({ keepalive: true })
    expect(onReport).toHaveBeenCalled()
    const reportTitleParagraph = inner?.querySelector<HTMLParagraphElement>(".moz-ads-placement-report-title")
    expect(reportTitleParagraph).toBeInstanceOf(HTMLParagraphElement)
    expect(reportTitleParagraph?.textContent).toEqual("Thank you for your feedback.")
    const disabledLinkClickEvent = new MouseEvent("click")
    disabledLinkClickEvent.preventDefault = jest.fn(disabledLinkClickEvent.preventDefault)
    link?.onclick?.(disabledLinkClickEvent as PointerEvent)
    expect(disabledLinkClickEvent.preventDefault).toHaveBeenCalled()
  })

  test("renderPlacement logs an error when the report callback URL is invalid", async () => {
    const placementElement = document.createElement("div")
    const placement = {
      placementId: "pocket_billboard_1",
      iabContentCategoryIds: ["IAB1"],
      content: {
        format: "billboard",
        callbacks: {
          click: "https://example.com/click",
          impression: "https://example.com/impression",
          report: undefined,
        },
        image_url: "https://example.com/image",
        block_key: "1234567890ABCDEFGHabcdefgh",
      },
    }

    renderPlacement(placementElement, {
      placement,
    })
    await tick()

    const link = placementElement.querySelector<HTMLAnchorElement>(".moz-ads-placement-link[data-placement-id=\"pocket_billboard_1\"]")
    expect(link).toBeInstanceOf(HTMLAnchorElement)
    expect(link?.href).toEqual("about:blank")
    const img = link?.querySelector<HTMLImageElement>(".moz-ads-placement-img[data-placement-id=\"pocket_billboard_1\"]")
    expect(img).toBeInstanceOf(HTMLImageElement)
    expect(img?.alt).toEqual("Billboard Ad 1")
    const reportButton = placementElement.querySelector<HTMLButtonElement>(".moz-ads-placement-report-button")
    expect(reportButton).toBeInstanceOf(HTMLButtonElement)
    expect(reportButton?.title).toEqual("Report ad")
    reportButton?.dispatchEvent(new MouseEvent("click"))
    const inner = placementElement.querySelector<HTMLDivElement>(".moz-ads-placement-inner")
    expect(inner).toBeInstanceOf(HTMLDivElement)
    const reportForm = inner?.querySelector<HTMLFormElement>(".moz-ads-placement-report-form")
    expect(reportForm).toBeInstanceOf(HTMLFormElement)
    const reportSubmitButton = reportForm?.querySelector<HTMLButtonElement>(".moz-ads-placement-report-submit-button")
    expect(reportSubmitButton).toBeInstanceOf(HTMLButtonElement)
    expect(reportSubmitButton?.disabled).toBeTruthy()
    const reportSelect = reportForm?.querySelector<HTMLSelectElement>(".moz-ads-placement-report-reason-select")
    expect(reportSelect).toBeInstanceOf(HTMLSelectElement)
    reportSelect!.value = "not_interested"
    reportSelect?.dispatchEvent(new Event("change"))
    expect(reportSubmitButton?.disabled).toBeFalsy()

    const logErrorSpy = jest.spyOn(DefaultLogger.prototype, "error")
    reportForm?.dispatchEvent(new Event("submit"))
    await tick()
    expect(logErrorSpy).toHaveBeenLastCalledWith("Invalid report callback URL for placement ID: pocket_billboard_1",
      { eventLabel: "invalid_url_error", path: "null or undefined", placementId: "pocket_billboard_1", type: "renderPlacement.reportCallbackInvalid" })
  })

  test("renderPlacement logs an error when the fetch to the report callback URL fails", async () => {
    const placementElement = document.createElement("div")
    const placement = {
      placementId: "pocket_billboard_1",
      iabContentCategoryIds: ["IAB1"],
      content: {
        format: "billboard",
        callbacks: {
          click: "https://example.com/click",
          impression: "https://example.com/impression",
          report: "https://example.com/report",
        },
        image_url: "https://example.com/image",
        block_key: "1234567890ABCDEFGHabcdefgh",
      },
    }

    renderPlacement(placementElement, {
      placement,
    })
    await tick()

    const link = placementElement.querySelector<HTMLAnchorElement>(".moz-ads-placement-link[data-placement-id=\"pocket_billboard_1\"]")
    expect(link).toBeInstanceOf(HTMLAnchorElement)
    expect(link?.href).toEqual("about:blank")
    const img = link?.querySelector<HTMLImageElement>(".moz-ads-placement-img[data-placement-id=\"pocket_billboard_1\"]")
    expect(img).toBeInstanceOf(HTMLImageElement)
    expect(img?.alt).toEqual("Billboard Ad 1")
    const reportButton = placementElement.querySelector<HTMLButtonElement>(".moz-ads-placement-report-button")
    expect(reportButton).toBeInstanceOf(HTMLButtonElement)
    expect(reportButton?.title).toEqual("Report ad")
    reportButton?.dispatchEvent(new MouseEvent("click"))
    const inner = placementElement.querySelector<HTMLDivElement>(".moz-ads-placement-inner")
    expect(inner).toBeInstanceOf(HTMLDivElement)
    const reportForm = inner?.querySelector<HTMLFormElement>(".moz-ads-placement-report-form")
    expect(reportForm).toBeInstanceOf(HTMLFormElement)
    const reportSubmitButton = reportForm?.querySelector<HTMLButtonElement>(".moz-ads-placement-report-submit-button")
    expect(reportSubmitButton).toBeInstanceOf(HTMLButtonElement)
    expect(reportSubmitButton?.disabled).toBeTruthy()
    const reportSelect = reportForm?.querySelector<HTMLSelectElement>(".moz-ads-placement-report-reason-select")
    expect(reportSelect).toBeInstanceOf(HTMLSelectElement)
    reportSelect!.value = "not_interested"
    reportSelect?.dispatchEvent(new Event("change"))
    expect(reportSubmitButton?.disabled).toBeFalsy()

    const logErrorSpy = jest.spyOn(DefaultLogger.prototype, "error")
    fetchMock.mockReject(new Error("test-error"))
    reportForm?.dispatchEvent(new Event("submit"))
    await tick()
    expect(logErrorSpy).toHaveBeenLastCalledWith("Report callback fetch request failed for: pocket_billboard_1.",
      { errorId: "Error", eventLabel: "fetch_error", method: "GET", path: "https://example.com/report", placementId: "pocket_billboard_1", type: "renderPlacement.reportCallbackResponseError" })
  })

  test("renderPlacement exits early for fallback ads", async () => {
    const logErrorSpy = jest.spyOn(DefaultLogger.prototype, "error")
    const placementElement = document.createElement("div")
    const placement = {
      placementId: "pocket_billboard_1",
      content: {
        format: "billboard",
        url: FallbackAdURL["Billboard"],
        image_url: `blob://billboard-blob-${Date.now()}`,
      },
    }

    renderPlacement(placementElement, {
      placement,
    })
    await tick()

    const reportButton = placementElement.querySelector<HTMLButtonElement>(".moz-ads-placement-report-button")
    reportButton?.dispatchEvent(new MouseEvent("click"))
    const inner = placementElement.querySelector<HTMLDivElement>(".moz-ads-placement-inner")
    const reportForm = inner?.querySelector<HTMLFormElement>(".moz-ads-placement-report-form")
    const reportSelect = reportForm?.querySelector<HTMLSelectElement>(".moz-ads-placement-report-reason-select")
    reportSelect!.value = "not_interested"
    reportSelect?.dispatchEvent(new Event("change"))
    reportForm?.dispatchEvent(new Event("submit"))
    await tick()

    expect(logErrorSpy).not.toHaveBeenCalled()
    expect(fetchMock.mock.calls.length).toBe(0)
  })

  test("renderPlacement logs an error when the builder's callback fails", async () => {
    const placementElement = document.createElement("div")
    const placement = {
      placementId: "pocket_billboard_1",
      iabContentCategoryIds: ["IAB1"],
      content: {
        format: "billboard",
        callbacks: {
          click: "https://example.com/click",
          impression: "https://example.com/impression",
          report: "https://example.com/report",
        },
        image_url: "https://example.com/image",
        block_key: "1234567890ABCDEFGHabcdefgh",
      },
    }

    renderPlacement(placementElement, {
      placement,
      onReport: () => { throw new Error ("uh oh") },
    })
    await tick()

    const link = placementElement.querySelector<HTMLAnchorElement>(".moz-ads-placement-link[data-placement-id=\"pocket_billboard_1\"]")
    expect(link).toBeInstanceOf(HTMLAnchorElement)
    expect(link?.href).toEqual("about:blank")
    const img = link?.querySelector<HTMLImageElement>(".moz-ads-placement-img[data-placement-id=\"pocket_billboard_1\"]")
    expect(img).toBeInstanceOf(HTMLImageElement)
    expect(img?.alt).toEqual("Billboard Ad 1")
    const reportButton = placementElement.querySelector<HTMLButtonElement>(".moz-ads-placement-report-button")
    expect(reportButton).toBeInstanceOf(HTMLButtonElement)
    expect(reportButton?.title).toEqual("Report ad")
    reportButton?.dispatchEvent(new MouseEvent("click"))
    const inner = placementElement.querySelector<HTMLDivElement>(".moz-ads-placement-inner")
    expect(inner).toBeInstanceOf(HTMLDivElement)
    const reportForm = inner?.querySelector<HTMLFormElement>(".moz-ads-placement-report-form")
    expect(reportForm).toBeInstanceOf(HTMLFormElement)
    const reportSubmitButton = reportForm?.querySelector<HTMLButtonElement>(".moz-ads-placement-report-submit-button")
    expect(reportSubmitButton).toBeInstanceOf(HTMLButtonElement)
    expect(reportSubmitButton?.disabled).toBeTruthy()
    const reportSelect = reportForm?.querySelector<HTMLSelectElement>(".moz-ads-placement-report-reason-select")
    expect(reportSelect).toBeInstanceOf(HTMLSelectElement)
    reportSelect!.value = "not_interested"
    reportSelect?.dispatchEvent(new Event("change"))
    expect(reportSubmitButton?.disabled).toBeFalsy()

    const logErrorSpy = jest.spyOn(DefaultLogger.prototype, "error")
    fetchMock.mockReject(new Error("test-error"))
    reportForm?.dispatchEvent(new Event("submit"))
    await tick()
    expect(logErrorSpy).toHaveBeenLastCalledWith("Builder's report callback failed for: pocket_billboard_1.",
      { errorId: "Error", placementId: "pocket_billboard_1", type: "renderPlacement.buildersReportCallbackError" })
  })
})
