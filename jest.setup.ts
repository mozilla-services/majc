import fetchMock from 'jest-fetch-mock'
import { INSTRUMENT_ENDPOINT } from './packages/core/src/constants'
import mockConsole from './packages/core/test/mocks/mockConsole'
import { MockDate } from './packages/core/test/mocks/mockDate'
import { MockImage } from './packages/core/test/mocks/mockImage'

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

globalThis.URL.createObjectURL = jest.fn().mockImplementation((blob: Blob): string => {
  return `blob://blobbish-${blob.type}-${Date.now()}`
})

globalThis.URL.canParse = jest.fn().mockImplementation((url: string | URL) => {
  const urlString = url.toString()
  const isTestURL = [
    'https://fake_click_url',
    'https://fake_impression_url',
    'https://example.com',
    `${INSTRUMENT_ENDPOINT}`,
  ].reduce((acc, curr): boolean => {
    return acc = acc || urlString.startsWith(curr)
  }, false)
  return isTestURL
})

fetchMock.enableMocks()
