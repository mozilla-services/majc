import { getConfig, getConfigValue, setConfigValue } from "../src/config"

describe("core/config.ts", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test("Gets the default config", () => {
    expect(getConfig()).toEqual({
      gppEnabled: false,
      gppReadyTimeout: 250,
    })
  })

  test("Gets the specified config values", () => {
    expect(getConfigValue("gppEnabled")).toBeDefined()
    expect(getConfigValue("gppEnabled")).toBeFalsy()

    expect(getConfigValue("gppReadyTimeout")).toBeDefined()
    expect(getConfigValue("gppReadyTimeout")).toEqual(250)
  })

  test("Sets the specified config values", () => {
    expect(getConfigValue("gppEnabled")).toBeDefined()
    expect(getConfigValue("gppEnabled")).toBeFalsy()
    setConfigValue("gppEnabled", true)
    expect(getConfigValue("gppEnabled")).toBeTruthy()

    expect(getConfigValue("gppReadyTimeout")).toBeDefined()
    expect(getConfigValue("gppReadyTimeout")).toEqual(250)
    setConfigValue("gppReadyTimeout", 12_345)
    expect(getConfigValue("gppReadyTimeout")).toEqual(12_345)
  })
})
