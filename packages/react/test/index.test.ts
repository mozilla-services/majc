import * as index from "../src/index"

describe("react/index.ts", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test("MozAdsPlacement is exported in react/index", () => {
    expect(index.MozAdsPlacement).toBeInstanceOf(Function)
  })

  test("useMozAdsPlacement is exported in react/index", () => {
    expect(index.useMozAdsPlacement).toBeInstanceOf(Function)
  })
})
