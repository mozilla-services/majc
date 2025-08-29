import { mockLocalStorage, mockSessionStorage } from "./mocks/mockStorage"
import { getItemFromStore, getOrGenerateContextId, removeItemFromStore, setItemInStore, StoreType } from "../src/store"

describe("core/store.ts", () => {
  afterEach(() => {
    jest.clearAllMocks()

    mockLocalStorage.clear()
    mockSessionStorage.clear()
  })

  Object.defineProperty(globalThis, "localStorage", {
    value: mockLocalStorage,
  })

  Object.defineProperty(globalThis, "sessionStorage", {
    value: mockSessionStorage,
  })

  test("store module sets and removes items in localStorage", () => {
    setItemInStore("contextId", "test_contextId", StoreType.Persistent)
    expect(getItemFromStore("contextId", StoreType.Persistent)).toBe("test_contextId")
    removeItemFromStore("contextId", StoreType.Persistent)
    expect(getItemFromStore("contextId", StoreType.Persistent)).toBeNull()
  })

  test("store module sets and removes items in sessionStorage", () => {
    setItemInStore("contextId", "test_contextId")
    expect(getItemFromStore("contextId")).toBe("test_contextId")
    expect(getItemFromStore("contextId", StoreType.SessionOnly)).toBe("test_contextId")
    removeItemFromStore("contextId")
    expect(getItemFromStore("contextId")).toBeNull()
    expect(getItemFromStore("contextId", StoreType.SessionOnly)).toBeNull()
  })

  test("store module gets or generates a contextId in sessionStorage", () => {
    setItemInStore("contextId", "test_contextId")
    expect(getOrGenerateContextId()).toBe("test_contextId")
    expect(getOrGenerateContextId(true)).not.toBe("test_contextId")
  })
})
