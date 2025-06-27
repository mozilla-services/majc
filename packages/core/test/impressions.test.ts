import { DefaultLogger } from "../src/logger"
import { DefaultMozAdsImpressionObserver } from "../src/impressions"
import fetchMock from "jest-fetch-mock"
import { MOCK_AD_PLACEMENTS } from "./mocks/mockAdPlacements"
import { MockIntersectionObserver } from "./mocks/mockIntersectionObserver"
import { tick } from "@/jest.setup"

describe("core/impresssions.ts", () => {
  let defaultObserver: DefaultMozAdsImpressionObserver
  let placementElement1: HTMLElement
  let placementElement2: HTMLElement
  let invalidPlacementElement: HTMLElement
  let fallbackPlacementElement: HTMLElement

  const logErrorSpy = jest.spyOn(DefaultLogger.prototype, "error")
  const logInfoSpy = jest.spyOn(DefaultLogger.prototype, "info")

  beforeEach(() => {
    placementElement1 = document.createElement("img")
    placementElement2 = document.createElement("img")
    invalidPlacementElement = document.createElement("img")
    fallbackPlacementElement = document.createElement("img")

    placementElement1.className = "moz-ads-placement-img"
    placementElement2.className = "moz-ads-placement-img"
    fallbackPlacementElement.className = "moz-ads-placement-img"

    placementElement1.dataset.placementId = "pocket_billboard_1"
    placementElement2.dataset.placementId = "pocket_billboard_2"
    fallbackPlacementElement.dataset.placementId = "fallback_placement_1"

    globalThis.IntersectionObserver = MockIntersectionObserver
    defaultObserver = new DefaultMozAdsImpressionObserver()

    document.body.appendChild(placementElement1)
    document.body.appendChild(placementElement2)
    document.body.appendChild(fallbackPlacementElement)
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllMocks()
    document.body.innerHTML = ""
    document.head.innerHTML = ""
    jest.useRealTimers()
  })

  describe("forceRecordImpression and recordImpression", () => {
    describe("sends a request to the impression callback url", () => {
      test("when the placement is not tracked", () => {
        jest.useRealTimers()

        defaultObserver.forceRecordImpression(MOCK_AD_PLACEMENTS["pocket_billboard_1"])

        expect(logInfoSpy).toHaveBeenCalledWith("Impression occurred for placement: pocket_billboard_1", { placementId: "pocket_billboard_1", type: "impressionObserver.recordImpression.viewed" })
        expect(fetchMock.mock.calls.length).toBe(2)
        expect(fetchMock.mock.calls[0][0]).toBe("https://ads.allizom.org/v1/log?event=init")
        expect(fetchMock.mock.calls[1][0]).toBe("https://fake_impression_url.abc/1")
      })

      test("when the placement is not viewed", () => {
        jest.useRealTimers()

        const unObserveSpy = jest.spyOn(defaultObserver.intersectionObserver!, "unobserve")
        defaultObserver.observe(MOCK_AD_PLACEMENTS["pocket_billboard_1"])
        expect(defaultObserver.impressionTracker["pocket_billboard_1"].viewStatus).toEqual("unseen")

        defaultObserver.forceRecordImpression(MOCK_AD_PLACEMENTS["pocket_billboard_1"])

        expect(logInfoSpy).toHaveBeenCalledWith("Impression occurred for placement: pocket_billboard_1", { placementId: "pocket_billboard_1", type: "impressionObserver.recordImpression.viewed" })
        expect(fetchMock.mock.calls.length).toBe(1)
        expect(fetchMock.mock.calls[0][0]).toBe("https://fake_impression_url.abc/1")
        expect(defaultObserver.impressionTracker["pocket_billboard_1"].viewStatus).toEqual("viewed")
        expect(unObserveSpy).toHaveBeenCalledWith(placementElement1)
      })
    })

    describe("logs an error", () => {
      test("and exits early when the impression callback URL is missing", () => {
        jest.useRealTimers()

        defaultObserver.forceRecordImpression({
          placementId: "pocket_billboard_1",
          content: {
            callbacks: {
              click: "invalid-click-callback-url",
              impression: null,
            },
          },
        })

        expect(logErrorSpy).toHaveBeenCalledWith(
          "Invalid impression URL for placement: pocket_billboard_1",
          { type: "impressionObserver.recordImpression.invalidCallbackError", path: "null or undefined", eventLabel: "invalid_url_error" })
        expect(logInfoSpy).not.toHaveBeenCalled()
        expect(fetchMock.mock.calls.length).toBe(1)
        expect(fetchMock.mock.calls[0][0]).toBe("https://ads.allizom.org/v1/log?event=invalid_url_error")
      })

      test("and exits early when the impression callback URL is invalid", () => {
        jest.useRealTimers()

        defaultObserver.forceRecordImpression({
          placementId: "pocket_billboard_1",
          content: {
            callbacks: {
              click: "invalid-click-callback-url",
              impression: "invalid-impression-callback-url",
            },
          },
        })

        expect(logErrorSpy).toHaveBeenCalledWith(
          "Invalid impression URL for placement: pocket_billboard_1",
          { type: "impressionObserver.recordImpression.invalidCallbackError", path: "invalid-impression-callback-url", eventLabel: "invalid_url_error" })
        expect(logInfoSpy).not.toHaveBeenCalled()
        expect(fetchMock.mock.calls.length).toBe(1)
        expect(fetchMock.mock.calls[0][0]).toBe("https://ads.allizom.org/v1/log?event=invalid_url_error")
      })

      test("when the impression callback request fails", async () => {
        jest.useRealTimers()

        fetchMock.mockResponse(async () => ({
          init: {
            status: 500,
          },
        }))

        defaultObserver.forceRecordImpression({
          placementId: "pocket_billboard_1",
          content: {
            callbacks: {
              click: "https://example.com/click",
              impression: "https://example.com/impression",
            },
          },
        })

        expect(fetchMock.mock.lastCall?.[0]).toEqual("https://example.com/impression")
        expect(fetchMock.mock.lastCall?.[1]).toEqual({ keepalive: true })

        await tick()

        expect(logErrorSpy).toHaveBeenLastCalledWith("Impression callback returned a non-200 for placement: pocket_billboard_1",
          { errorId: "500", eventLabel: "fetch_error", method: "GET", path: "https://example.com/impression", placementId: "pocket_billboard_1", type: "impressionObserver.recordImpression.callbackResponseError" })
      })
    })
  })

  test("ads are observed when asked", () => {
    const observerSpy = jest.spyOn(defaultObserver.intersectionObserver!, "observe")
    defaultObserver.observe(MOCK_AD_PLACEMENTS["pocket_billboard_1"])
    defaultObserver.observe(MOCK_AD_PLACEMENTS["pocket_billboard_2"])
    defaultObserver.observe(MOCK_AD_PLACEMENTS["invalid_placement_1"])
    expect(observerSpy).toHaveBeenCalledWith(placementElement1)
    expect(observerSpy).toHaveBeenCalledWith(placementElement2)
    expect(observerSpy).toHaveBeenCalledTimes(2)
  })

  test("fallback ads are not observed", () => {
    defaultObserver.observe(MOCK_AD_PLACEMENTS["pocket_billboard_1"])
    defaultObserver.observe(MOCK_AD_PLACEMENTS["fallback_placement_1"])
    expect(defaultObserver.impressionTracker["pocket_billboard_1"]).toBeTruthy()
    expect(defaultObserver.impressionTracker["fallback_placement_1"]).toBeUndefined()
  })

  test("ignore invalid entries observed by the IntersectionObserver", async () => {
    defaultObserver.observe(MOCK_AD_PLACEMENTS["pocket_billboard_1"])
    defaultObserver.observe(MOCK_AD_PLACEMENTS["pocket_billboard_2"])
    expect(defaultObserver.impressionTracker["pocket_billboard_1"].viewStatus).toEqual("unseen")
    expect(defaultObserver.impressionTracker["pocket_billboard_2"].viewStatus).toEqual("unseen")
    delete defaultObserver.impressionTracker["pocket_billboard_1"]
    const mockIntersectionObserver = defaultObserver.intersectionObserver as MockIntersectionObserver
    const newElementIntersectionRatios = new Map([
      [placementElement1, 0.1],
      [placementElement2, 0.5],
      [invalidPlacementElement, 1.0],
    ])
    mockIntersectionObserver.mockForceCallback(newElementIntersectionRatios)
    expect(defaultObserver.impressionTracker["pocket_billboard_2"].viewStatus).toEqual("in-view")
  })

  describe("unseen element", () => {
    test("successfully becomes in-view when above threshold", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recordImpressionSpy = jest.spyOn(defaultObserver as any, "recordImpression")
      const unobserveSpy = jest.spyOn(defaultObserver.intersectionObserver!, "unobserve")
      defaultObserver.observe(MOCK_AD_PLACEMENTS["pocket_billboard_1"])
      defaultObserver.observe(MOCK_AD_PLACEMENTS["pocket_billboard_2"])
      expect(defaultObserver.impressionTracker["pocket_billboard_1"].viewStatus).toEqual("unseen")
      expect(defaultObserver.impressionTracker["pocket_billboard_2"].viewStatus).toEqual("unseen")
      const mockIntersectionObserver = defaultObserver.intersectionObserver as MockIntersectionObserver
      const newElementIntersectionRatios = new Map([
        [placementElement1, 0.5],
        [placementElement2, 0.0],
      ])
      mockIntersectionObserver.mockForceCallback(newElementIntersectionRatios)

      // Verify statuses are as expected
      expect(defaultObserver.impressionTracker["pocket_billboard_1"].viewStatus).toEqual("in-view")
      expect(defaultObserver.impressionTracker["pocket_billboard_2"].viewStatus).toEqual("unseen")

      // Verify in-view elements are still tracked
      expect((defaultObserver.intersectionObserver as MockIntersectionObserver).observedElements.get(placementElement1)).not.toBeNull()
      expect((defaultObserver.intersectionObserver as MockIntersectionObserver).observedElements.get(placementElement2)).not.toBeNull()

      // Verify no impressions have been recorded and nothing has been unobserved
      expect(recordImpressionSpy).toHaveBeenCalledTimes(0)
      expect(unobserveSpy).toHaveBeenCalledTimes(0)
    })

    test("remains unseen when out of threshold", () => {
      defaultObserver.observe(MOCK_AD_PLACEMENTS["pocket_billboard_1"])
      defaultObserver.observe(MOCK_AD_PLACEMENTS["pocket_billboard_2"])
      expect(defaultObserver.impressionTracker["pocket_billboard_1"].viewStatus).toEqual("unseen")
      expect(defaultObserver.impressionTracker["pocket_billboard_2"].viewStatus).toEqual("unseen")
      const mockIntersectionObserver = defaultObserver.intersectionObserver as MockIntersectionObserver
      const newElementIntersectionRatios = new Map([
        [placementElement1, 0.2],
        [placementElement2, 0.1],
      ])
      mockIntersectionObserver.mockForceCallback(newElementIntersectionRatios)
      expect(defaultObserver.impressionTracker["pocket_billboard_1"].viewStatus).toEqual("unseen")
      expect(defaultObserver.impressionTracker["pocket_billboard_2"].viewStatus).toEqual("unseen")
    })
  })

  describe("in-view element", () => {
    test("becomes viewed when remaining above threshold", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recordImpressionSpy = jest.spyOn(defaultObserver as any, "recordImpression")
      const unobserveSpy = jest.spyOn(defaultObserver.intersectionObserver!, "unobserve")
      defaultObserver.observe(MOCK_AD_PLACEMENTS["pocket_billboard_1"])
      defaultObserver.observe(MOCK_AD_PLACEMENTS["pocket_billboard_2"])
      expect(defaultObserver.impressionTracker["pocket_billboard_1"].viewStatus).toEqual("unseen")
      expect(defaultObserver.impressionTracker["pocket_billboard_2"].viewStatus).toEqual("unseen")

      const mockIntersectionObserver = defaultObserver.intersectionObserver as MockIntersectionObserver
      const newElementIntersectionRatios = new Map([
        [placementElement1, 0.5],
        [placementElement2, 0.0],
      ])

      mockIntersectionObserver.mockForceCallback(newElementIntersectionRatios)

      // Redudant, but we again verify unseen -> in-view is still successful for this test to continue.
      expect(defaultObserver.impressionTracker["pocket_billboard_1"].viewStatus).toEqual("in-view")
      expect(defaultObserver.impressionTracker["pocket_billboard_2"].viewStatus).toEqual("unseen")

      // Forces all mocked timeouts to fire as if the user had viewed the user had viewed the div for the expected time
      jest.runAllTimers()

      // Verify statuses change to expected values
      expect(defaultObserver.impressionTracker["pocket_billboard_1"].viewStatus).toEqual("viewed")
      expect(defaultObserver.impressionTracker["pocket_billboard_2"].viewStatus).toEqual("unseen")

      // Verify expected number of impressions are recorded
      expect(recordImpressionSpy).toHaveBeenCalledTimes(1)

      // Verify 'viewed' elements are no longer tracked
      expect((defaultObserver.intersectionObserver as MockIntersectionObserver).observedElements.get(placementElement1)).toBeUndefined()
      expect((defaultObserver.intersectionObserver as MockIntersectionObserver).observedElements.get(placementElement2)).not.toBeNull()
      expect(unobserveSpy).toHaveBeenCalledTimes(1)
    })

    test("becomes unseen when going out of threshold", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recordImpressionSpy = jest.spyOn(defaultObserver as any, "recordImpression")
      defaultObserver.observe(MOCK_AD_PLACEMENTS["pocket_billboard_1"])
      defaultObserver.observe(MOCK_AD_PLACEMENTS["pocket_billboard_2"])
      expect(defaultObserver.impressionTracker["pocket_billboard_1"].viewStatus).toEqual("unseen")
      expect(defaultObserver.impressionTracker["pocket_billboard_2"].viewStatus).toEqual("unseen")

      const mockIntersectionObserver = defaultObserver.intersectionObserver as MockIntersectionObserver
      const newElementIntersectionRatios = new Map([
        [placementElement1, 0.5],
        [placementElement2, 0.0],
      ])

      mockIntersectionObserver.mockForceCallback(newElementIntersectionRatios)

      expect(defaultObserver.impressionTracker["pocket_billboard_1"].viewStatus).toEqual("in-view")
      expect(defaultObserver.impressionTracker["pocket_billboard_2"].viewStatus).toEqual("unseen")

      const clearTimeoutSpy = jest.spyOn(globalThis, "clearTimeout")
      const inViewTimeout = defaultObserver.impressionTracker["pocket_billboard_1"].timeout

      mockIntersectionObserver.mockForceCallback(new Map([
        [placementElement1, 0.2],
      ]))

      // Verify statuses return to normal
      expect(defaultObserver.impressionTracker["pocket_billboard_1"].viewStatus).toEqual("unseen")
      expect(defaultObserver.impressionTracker["pocket_billboard_2"].viewStatus).toEqual("unseen")

      // Verify no impressions are recorded
      expect(recordImpressionSpy).toHaveBeenCalledTimes(0)
      expect(clearTimeoutSpy).toHaveBeenCalledWith(inViewTimeout)
    })
  })
})
