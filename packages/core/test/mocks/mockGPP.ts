import { GPPWrapperInterface } from "@core/gpp"

export function isolateAndMockGPP(): Promise<[jest.Mock, GPPWrapperInterface]> {
  return new Promise(resolve => jest.isolateModules(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const gppWrapper = require("../../src/gpp").gppWrapper

    delete globalThis.__gpp

    const mockGPPFunction = jest.fn()
    Object.defineProperty(globalThis, "__gpp", {
      configurable: true,
      value: mockGPPFunction,
    })

    resolve([mockGPPFunction, gppWrapper])
  }))
}
