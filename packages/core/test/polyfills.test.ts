import { withResolvers } from "../src/polyfills"

describe("core/polyfills.ts", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test("Define `Promise.withResolvers`", () => {
    expect(Promise.withResolvers).toBeDefined()
    expect(Promise.withResolvers).toBeInstanceOf(Function)
  })

  test("Polyfilled `Promise.withResolvers` should return a `Promise` with `resolve` and `reject` functions", () => {
    const promiseWithResolvers = withResolvers()
    expect(promiseWithResolvers).toBeDefined()
    expect(promiseWithResolvers).toBeInstanceOf(Object)
    expect(promiseWithResolvers.promise).toBeInstanceOf(Promise)
    expect(promiseWithResolvers.reject).toBeInstanceOf(Function)
    expect(promiseWithResolvers.resolve).toBeInstanceOf(Function)
  })
})
