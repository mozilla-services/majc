import fetchMock from 'jest-fetch-mock'
import mockConsole from './packages/core/test/mocks/mockConsole'
import { MockDate } from './packages/core/test/mocks/mockDate'
import { MockImage } from './packages/core/test/mocks/mockImage'
import { MockURL } from './packages/core/test/mocks/mockURL'

export function wait(ms?: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function tick(): Promise<void> {
  return wait()
}

Object.defineProperty(globalThis, 'console', {
  value: mockConsole,
})

Object.defineProperty(globalThis, 'Date', {
  value: MockDate,
})

Object.defineProperty(globalThis, 'Image', {
  value: MockImage,
})

Object.defineProperty(globalThis, 'URL', {
  value: MockURL,
})

fetchMock.enableMocks()
