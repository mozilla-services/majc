/* eslint @stylistic/quote-props: 0 */

import fetchMock from 'jest-fetch-mock'
import * as logger from '../src/logger'
import { recordClick } from '../src/clicks'
import { INSTRUMENT_ENDPOINT } from '../src/constants'

describe('core/clicks.ts', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('recordClick logs an error and exits when no click callback URL is provided', async () => {
    const placementWithoutContent = {
      placementId: 'pocket_billboard_1',
    }

    const consoleErrorMock = jest.spyOn(globalThis.console, 'error')
    fetchMock.mockResponse(async () => ({}))

    await recordClick(placementWithoutContent)

    expect(fetchMock.mock.lastCall?.[0]).toEqual(`${INSTRUMENT_ENDPOINT}?event=invalid_url_error`)
    expect(fetchMock.mock.lastCall?.[1]).toEqual({ keepalive: true })
    expect(consoleErrorMock).toHaveBeenLastCalledWith('Invalid click URL for placement: pocket_billboard_1')
  })

  test('recordClick logs an error and fails when the fetch fails with an error', async () => {
    const placementWithContent = {
      placementId: 'pocket_billboard_1',
      content: {
        format: 'billboard',
        url: 'https://getpocket.com/',
        callbacks: {
          click: 'http://example.com/click',
          impression: 'http://example.com/impression',
          report: 'http://example.com/report',
        },
        image_url: 'http://example.com/image',
        alt_text: 'Advertiser Name',
        block_key: '1234567890ABCDEFGHabcdefgh',
      },
    }

    const consoleErrorMock = jest.spyOn(globalThis.console, 'error')
    fetchMock.mockReject(new Error('test-error'))

    await recordClick(placementWithContent)

    expect(fetchMock.mock.lastCall?.[0]).toEqual(`${INSTRUMENT_ENDPOINT}?event=fetch_error`)
    expect(fetchMock.mock.lastCall?.[1]).toEqual({ keepalive: true })
    expect(consoleErrorMock).toHaveBeenLastCalledWith('Click callback failed for: pocket_billboard_1 with an unknown error.')
  })

  test('recordClick logs an error and fails when the fetch fails for an unknown reason', async () => {
    const placementWithContent = {
      placementId: 'pocket_billboard_1',
      content: {
        format: 'billboard',
        url: 'https://getpocket.com/',
        callbacks: {
          click: 'http://example.com/click',
          impression: 'http://example.com/impression',
          report: 'http://example.com/report',
        },
        image_url: 'http://example.com/image',
        alt_text: 'Advertiser Name',
        block_key: '1234567890ABCDEFGHabcdefgh',
      },
    }

    const consoleErrorMock = jest.spyOn(globalThis.console, 'error')
    fetchMock.mockReject()

    await recordClick(placementWithContent)

    expect(fetchMock.mock.lastCall?.[0]).toEqual(`${INSTRUMENT_ENDPOINT}?event=fetch_error`)
    expect(fetchMock.mock.lastCall?.[1]).toEqual({ keepalive: true })
    expect(consoleErrorMock).toHaveBeenLastCalledWith('Click callback failed for: pocket_billboard_1 with an unknown error.')
  })

  test('recordClick fetches the click callback successfully', async () => {
    const placementWithContent = {
      placementId: 'pocket_billboard_1',
      content: {
        format: 'billboard',
        url: 'https://getpocket.com/',
        callbacks: {
          click: 'http://example.com/click',
          impression: 'http://example.com/impression',
          report: 'http://example.com/report',
        },
        image_url: 'http://example.com/image',
        alt_text: 'Advertiser Name',
        block_key: '1234567890ABCDEFGHabcdefgh',
      },
    }

    fetchMock.mockResponse(async () => ({}))

    await recordClick(placementWithContent)

    expect(fetchMock.mock.lastCall?.[0]).toEqual('http://example.com/click')
    expect(fetchMock.mock.lastCall?.[1]).toEqual({ keepalive: true })
  })
})
