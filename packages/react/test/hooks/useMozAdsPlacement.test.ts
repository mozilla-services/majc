/* eslint @stylistic/quote-props: 0 */

import fetchMock from "jest-fetch-mock"
import { useMozAdsPlacement } from "@react/index"
import { renderHook, waitFor } from "@testing-library/react"

jest.mock("@core/logger", () => {
  const coreLogger = jest.requireActual("@core/logger")
  return {
    __esModule: true,
    ...coreLogger,
    get DefaultLogger() {
      return class BrokenLogger {
        constructor() {
          throw new Error("test-error")
        }
      }
    },
  }
})

describe("react/hooks/useMozAdsPlacement.ts", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test("useMozAdsPlacement fetches content for the requested ad placement", async () => {
    fetchMock.mockResponseOnce(async () => ({
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "pocket_billboard_0": [
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

    const { result: result1 } = renderHook(() => useMozAdsPlacement({
      placementId: "pocket_billboard_0",
    }))

    expect(result1.current).toEqual({
      placementId: "pocket_billboard_0",
    })

    await waitFor(() => {
      expect(result1.current?.content).toBeDefined()
    })

    expect(result1.current).toEqual({
      placementId: "pocket_billboard_0",
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
    })

    const { result: result2 } = renderHook(() => useMozAdsPlacement({
      placementId: "pocket_billboard_0",
    }))

    await waitFor(() => {
      expect(result2.current?.content).toBeDefined()
    })

    expect(result1.current === result2.current).toBeTruthy()
  })
})
