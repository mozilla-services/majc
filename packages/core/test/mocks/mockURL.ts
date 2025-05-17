import { INSTRUMENT_ENDPOINT } from '../../src/constants'

export class MockURLLib {
  static canParse(url: string | URL, base?: string | URL) {
    const urlString = url.toString()
    const isTestURL = [
      'https://fake_click_url',
      'https://fake_impression_url',
      'http://example.com',
      `${INSTRUMENT_ENDPOINT}`,
    ].reduce((acc, curr): boolean => {
      return acc = acc || urlString.startsWith(curr)
    }, false)
    console.log(`Testing url ${urlString}: isTestURL: ${isTestURL}`)
    console.log(isTestURL)
    return isTestURL
  }

  static createObjectURL(blob: Blob): string {
    return `blob://blobbish-${blob.type}-${Date.now()}`
  }
}

export const MockURL = MockURLLib
