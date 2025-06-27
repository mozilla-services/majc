import * as index from "../src/index"

describe("iife/index.ts", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test("renderPlacement is exported in iife/index", () => {
    expect(index.renderPlacement).toBeInstanceOf(Function)
  })
})
