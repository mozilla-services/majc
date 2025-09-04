import { GPPAddEventListenerCallback, GPPCommand, GPPEvent, GPPPing, GPPPingCallback, GPPRemoveEventListenerCallback } from "@core/types"
import { isolateAndMockGPP } from "./mocks/mockGPP"
import { mockLocalStorage } from "./mocks/mockStorage"
import { getItemFromStore, setItemInStore, StoreType } from "@core/store"
import { tick, wait } from "@/jest.setup"

describe("core/gpp.ts", () => {
  afterEach(() => {
    jest.clearAllMocks()

    mockLocalStorage.clear()
  })

  Object.defineProperty(globalThis, "localStorage", {
    value: mockLocalStorage,
  })

  test("addEventListener invokes 'addEventListener' command on __gpp global function when available", async () => {
    const [mockGPPFunction, gppWrapper] = await isolateAndMockGPP()
    mockGPPFunction.mockImplementationOnce((command: keyof GPPCommand, callback: GPPAddEventListenerCallback) => {
      setTimeout(() => callback({ eventName: "signalStatus" } as GPPEvent, true))
      return { listenerId: 1001 }
    })

    const listener = jest.fn()
    await gppWrapper.addEventListener("signalStatus", listener)
    expect(mockGPPFunction).toHaveBeenNthCalledWith(1, "addEventListener", expect.any(Function))
    await tick()
    expect(listener).toHaveBeenCalled()
  })

  test("addEventListener does not invoke its specified listener if the event has a different name", async () => {
    const [mockGPPFunction, gppWrapper] = await isolateAndMockGPP()
    mockGPPFunction.mockImplementationOnce((command: keyof GPPCommand, callback: GPPAddEventListenerCallback) => {
      setTimeout(() => callback({ eventName: "error" } as GPPEvent, true))
      return { listenerId: 1001 }
    })

    const listener = jest.fn()
    await gppWrapper.addEventListener("signalStatus", listener)
    expect(mockGPPFunction).toHaveBeenNthCalledWith(1, "addEventListener", expect.any(Function))
    await tick()
    expect(listener).not.toHaveBeenCalled()
  })

  test("addEventListener does not invoke its specified listener if the event was unsuccessful", async () => {
    const [mockGPPFunction, gppWrapper] = await isolateAndMockGPP()
    mockGPPFunction.mockImplementationOnce((command: keyof GPPCommand, callback: GPPAddEventListenerCallback) => {
      setTimeout(() => callback({ eventName: "signalStatus" } as GPPEvent, false))
      return { listenerId: 1001 }
    })

    const listener = jest.fn()
    await gppWrapper.addEventListener("signalStatus", listener)
    expect(mockGPPFunction).toHaveBeenNthCalledWith(1, "addEventListener", expect.any(Function))
    await tick()
    expect(listener).not.toHaveBeenCalled()
  })

  test("addEventListener invokes 'removeEventListener' automatically when the 'once' option is specified", async () => {
    const [mockGPPFunction, gppWrapper] = await isolateAndMockGPP()
    mockGPPFunction.mockImplementationOnce((command: keyof GPPCommand, callback: GPPAddEventListenerCallback) => {
      setTimeout(() => callback({ eventName: "signalStatus" } as GPPEvent, true))
      return { listenerId: 1001 }
    })

    mockGPPFunction.mockImplementationOnce((command: keyof GPPCommand, callback: GPPRemoveEventListenerCallback) => {
      setTimeout(() => callback(true, true))
    })

    const listener = jest.fn()
    await gppWrapper.addEventListener("signalStatus", listener, { once: true })
    expect(mockGPPFunction).toHaveBeenNthCalledWith(1, "addEventListener", expect.any(Function))
    await tick()
    expect(listener).toHaveBeenCalled()
    await tick()
    expect(mockGPPFunction).toHaveBeenNthCalledWith(2, "removeEventListener", expect.any(Function), 1001)
  })

  test("removeEventListener invokes 'removeEventListener' command on __gpp global function when available", async () => {
    const [mockGPPFunction, gppWrapper] = await isolateAndMockGPP()
    mockGPPFunction.mockImplementationOnce((command: keyof GPPCommand, callback: GPPAddEventListenerCallback) => {
      setTimeout(() => callback({ eventName: "signalStatus" } as GPPEvent, true))
      return { listenerId: 1001 }
    })

    mockGPPFunction.mockImplementationOnce((command: keyof GPPCommand, callback: GPPRemoveEventListenerCallback) => {
      setTimeout(() => callback(true, true))
    })

    const listener = jest.fn()
    await gppWrapper.addEventListener("signalStatus", listener)
    expect(mockGPPFunction).toHaveBeenNthCalledWith(1, "addEventListener", expect.any(Function))
    await tick()
    expect(listener).toHaveBeenCalled()
    await gppWrapper.removeEventListener("signalStatus", listener)
    await tick()
    expect(mockGPPFunction).toHaveBeenNthCalledWith(2, "removeEventListener", expect.any(Function), 1001)
  })

  test("removeEventListener avoids invoking 'removeEventListener' command on __gpp global function if the specified listener is not already added", async () => {
    const [mockGPPFunction, gppWrapper] = await isolateAndMockGPP()
    mockGPPFunction.mockImplementationOnce((command: keyof GPPCommand, callback: GPPRemoveEventListenerCallback) => {
      setTimeout(() => callback(true, true))
    })

    const listener = jest.fn()
    await gppWrapper.removeEventListener("signalStatus", listener)
    await tick()
    expect(mockGPPFunction).not.toHaveBeenCalled()
  })

  test("ping invokes 'ping' command on __gpp global function when available", async () => {
    const [mockGPPFunction, gppWrapper] = await isolateAndMockGPP()
    mockGPPFunction.mockImplementationOnce((command: keyof GPPCommand, callback: GPPPingCallback) => {
      setTimeout(() => callback({ signalStatus: "ready" } as GPPPing, true))
    })

    const ping = await gppWrapper.ping()
    expect(ping).toEqual({ signalStatus: "ready" })
    expect(mockGPPFunction).toHaveBeenNthCalledWith(1, "ping", expect.any(Function))
  })

  test("ping waits for a 'ready' signalStatus event if it is not ready when invoked", async () => {
    const [mockGPPFunction, gppWrapper] = await isolateAndMockGPP()
    mockGPPFunction.mockImplementationOnce((command: keyof GPPCommand, callback: GPPPingCallback) => {
      setTimeout(() => callback({ signalStatus: "not ready" } as GPPPing, true))
    })
    mockGPPFunction.mockImplementation((command: keyof GPPCommand, callback: GPPAddEventListenerCallback) => {
      setTimeout(() => callback({ eventName: "signalStatus", pingData: { signalStatus: "ready" } } as GPPEvent, true))
      return { listenerId: 1001 }
    })

    const ping = await gppWrapper.ping()
    expect(ping).toEqual({ signalStatus: "ready" })
    expect(mockGPPFunction).toHaveBeenNthCalledWith(1, "ping", expect.any(Function))
    expect(mockGPPFunction).toHaveBeenNthCalledWith(2, "addEventListener", expect.any(Function))
    expect(mockGPPFunction).toHaveBeenNthCalledWith(3, "addEventListener", expect.any(Function))
  })

  test("ping immediately returns the last-cached ping from localStorage if it exists", async () => {
    const [mockGPPFunction, gppWrapper] = await isolateAndMockGPP()
    mockGPPFunction.mockImplementationOnce((command: keyof GPPCommand, callback: GPPPingCallback) => {
      setTimeout(() => callback({ signalStatus: "not ready" } as GPPPing, true))
    })

    setItemInStore("gppPing", JSON.stringify({ foo: "bar" }), StoreType.Persistent)

    const ping = await gppWrapper.ping()
    expect(ping).toEqual({ foo: "bar" })
  })

  test("ping invokes 'ping' command on __gpp global if the last-cached ping data is invalid", async () => {
    const [mockGPPFunction, gppWrapper] = await isolateAndMockGPP()
    mockGPPFunction.mockImplementationOnce((command: keyof GPPCommand, callback: GPPPingCallback) => {
      setTimeout(() => callback({ signalStatus: "ready" } as GPPPing, true))
    })

    setItemInStore("gppPing", "invalid", StoreType.Persistent)

    const ping = await gppWrapper.ping()
    expect(ping).toEqual({ signalStatus: "ready" })
    expect(mockGPPFunction).toHaveBeenNthCalledWith(1, "ping", expect.any(Function))
  })

  test("ping starts monitoring for 'signalStatus' events on __gpp global function when available", async () => {
    const [mockGPPFunction, gppWrapper] = await isolateAndMockGPP()
    mockGPPFunction.mockImplementationOnce((command: keyof GPPCommand, callback: GPPPingCallback) => {
      setTimeout(() => callback({ signalStatus: "ready" } as GPPPing, true))
    })

    const gppWrapperAddEventListenerMock = jest.spyOn(gppWrapper, "addEventListener")

    setItemInStore("gppPing", JSON.stringify({ foo: "bar" }), StoreType.Persistent)

    const ping = await gppWrapper.ping()
    expect(ping).toEqual({ foo: "bar" })
    await tick()
    expect(mockGPPFunction).toHaveBeenNthCalledWith(1, "addEventListener", expect.any(Function))
    expect(gppWrapperAddEventListenerMock).toHaveBeenCalledWith("sectionChange", expect.any(Function))

    // Simulate incoming "signalStatus" event from `__gpp` global.
    mockGPPFunction.mock.calls[0][1]({ eventName: "sectionChange", pingData: { baz: "zzz" } }, true)

    const updatedPing = JSON.parse(getItemFromStore("gppPing", StoreType.Persistent) ?? "null")
    expect(updatedPing).toEqual({ baz: "zzz" })
  })

  test("ping auto-retries monitoring for 'signalStatus' events on __gpp global function when an error occurs", async () => {
    const [mockGPPFunction, gppWrapper] = await isolateAndMockGPP()
    mockGPPFunction.mockImplementationOnce(() => {
      throw new Error("test-error")
    })
    mockGPPFunction.mockImplementationOnce((command: keyof GPPCommand, callback: GPPPingCallback) => {
      setTimeout(() => callback({ signalStatus: "ready" } as GPPPing, true))
    })

    const gppWrapperAddEventListenerMock = jest.spyOn(gppWrapper, "addEventListener")

    setItemInStore("gppPing", JSON.stringify({ foo: "bar" }), StoreType.Persistent)

    const ping = await gppWrapper.ping()
    expect(ping).toEqual({ foo: "bar" })
    await tick()
    expect(mockGPPFunction).toHaveBeenCalledTimes(1)
    expect(mockGPPFunction).toHaveBeenNthCalledWith(1, "addEventListener", expect.any(Function))
    expect(gppWrapperAddEventListenerMock).toHaveBeenCalledWith("sectionChange", expect.any(Function))
    await wait(1)
    expect(mockGPPFunction).toHaveBeenCalledTimes(1)
    await wait(1_000)
    expect(mockGPPFunction).toHaveBeenCalledTimes(2)
    expect(mockGPPFunction).toHaveBeenNthCalledWith(2, "addEventListener", expect.any(Function))
    expect(gppWrapperAddEventListenerMock).toHaveBeenCalledWith("sectionChange", expect.any(Function))

    // Simulate incoming "signalStatus" event from `__gpp` global.
    mockGPPFunction.mock.calls[1][1]({ eventName: "sectionChange", pingData: { baz: "zzz" } }, true)

    const updatedPing = JSON.parse(getItemFromStore("gppPing", StoreType.Persistent) ?? "null")
    expect(updatedPing).toEqual({ baz: "zzz" })
  })
})
