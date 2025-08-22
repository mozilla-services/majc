import { cleanup, render } from "@testing-library/react"
import { MozAdsConfigProvider } from "../../src/components/MozAdsConfigProvider"

describe("react/components/MozAdsConfigProvider.tsx", () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
    cleanup()
  })

  test("<MozAdsConfigProvider /> renders children", async () => {
    const result = render(
      <MozAdsConfigProvider>
        <div role="alert">foo</div>
      </MozAdsConfigProvider>,
    )

    const alert = await result.findByRole("alert")
    expect(alert).toBeInstanceOf(HTMLDivElement)
    expect(alert.textContent).toEqual("foo")
  })
})
