import "../src/polyfills"

import { MockDate } from "./mocks/mockDate"

import { setConfigValue } from "../src/config"
import { getGPP, GetGPPError, getGPPPing } from "../src/gpp"

const mockGPPPing = {
  gppVersion: "",
  cmpStatus: "",
  cmpDisplayStatus: "",
  signalStatus: "",
  supportedAPIs: [],
  cmpId: 0,
  sectionList: [],
  applicableSections: [],
  gppString: "",
  parsedSections: {},
}

const mockGPPFunction = jest.fn((_command, callback) => {
  callback({ eventName: "signalStatus", pingData: mockGPPPing }, true)
})

describe("core/gpp.ts", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test("getGPP rejects after timeout when the GPPFunction is unavailable", async () => {
    delete globalThis.__gpp
    setConfigValue("gppReadyTimeout", 500)

    const getGPPPromise = getGPP()
    MockDate.currentTimeMs += 500 // Global time t+500ms
    await expect(getGPPPromise).rejects.toThrow(GetGPPError)
  })

  test("getGPPPing rejects after timeout when the GPPFunction is unavailable", async () => {
    delete globalThis.__gpp
    setConfigValue("gppReadyTimeout", 500)

    const getGPPPingPromise = getGPPPing()
    MockDate.currentTimeMs += 500 // Global time t+500ms
    await expect(getGPPPingPromise).rejects.toThrow(GetGPPError)
  })

  test("getGPP resolves with the GPPFunction when available", async () => {
    delete globalThis.__gpp

    Object.defineProperty(globalThis, "__gpp", {
      configurable: true,
      value: mockGPPFunction,
    })

    const gpp = await getGPP()
    expect(gpp).toEqual(mockGPPFunction)
  })

  test("getGPPPing resolves with the GPPPing when the GPPFunction is available and ready", async () => {
    delete globalThis.__gpp

    Object.defineProperty(globalThis, "__gpp", {
      configurable: true,
      value: mockGPPFunction,
    })

    const gppPing = await getGPPPing()
    expect(gppPing).toEqual(mockGPPPing)
  })

  test("getGPPPing rejects when the GPPFunction is available but fails to retrieve the GPPPing", async () => {
    delete globalThis.__gpp

    Object.defineProperty(globalThis, "__gpp", {
      configurable: true,
      value: mockGPPFunction,
    })

    mockGPPFunction.mockImplementationOnce((_command, callback) => {
      callback("FAILURE", false)
    })

    const getGPPPingPromise = getGPPPing()
    await expect(getGPPPingPromise).rejects.toEqual("FAILURE")
  })
})
