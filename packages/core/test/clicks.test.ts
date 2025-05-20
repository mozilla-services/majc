/* eslint @stylistic/quote-props: 0 */

import { DefaultLogger } from '../src/logger'
import { DefaultMozAdsImpressionObserver } from '../src/impressions'
import fetchMock from 'jest-fetch-mock'
import { recordClick } from '../src/clicks'

describe('core/clicks.ts recordClick', () => {
  const logErrorSpy = jest.spyOn(DefaultLogger.prototype, 'error')
  const logInfoSpy = jest.spyOn(DefaultLogger.prototype, 'info')
  const impressionObserverSpy = jest.spyOn(DefaultMozAdsImpressionObserver.prototype, 'forceRecordImpression')

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('exits early if the placement is a fallback ad', async () => {
    const placement = {
      placementId: 'pocket_billboard_1',
      content: {
        image_url: `blob://oh-my-glob-${Date.now()}`,
      },
    }

    await recordClick(placement)

    expect(logErrorSpy).not.toHaveBeenCalled()
    expect(logInfoSpy).not.toHaveBeenCalled()
    expect(impressionObserverSpy).not.toHaveBeenCalled()
  })

  test('logs an error and exits when no click callback URL is provided', async () => {
    const placement = {
      placementId: 'pocket_billboard_1',
    }

    fetchMock.mockResponse(async () => ({}))
    await recordClick(placement)

    expect(logErrorSpy).toHaveBeenLastCalledWith(
      'Invalid click URL for placement: pocket_billboard_1',
      { 'eventLabel': 'invalid_url_error', 'placementId': 'pocket_billboard_1', 'type': 'recordClick.invalidCallbackError' },
    )
    expect(logInfoSpy).not.toHaveBeenCalled()
    expect(impressionObserverSpy).not.toHaveBeenCalled()
  })

  test('catches and logs the error when the fetch fails with error', async () => {
    const placement = {
      placementId: 'pocket_billboard_1',
      content: {
        format: 'billboard',
        url: 'https://getpocket.com/',
        callbacks: {
          click: 'https://example.com/click',
          impression: 'https://example.com/impression',
          report: 'https://example.com/report',
        },
        image_url: 'https://example.com/image',
        alt_text: 'Advertiser Name',
        block_key: '1234567890ABCDEFGHabcdefgh',
      },
    }
    fetchMock.mockReject(new Error('test-error'))

    await recordClick(placement)

    expect(logInfoSpy).toHaveBeenCalled()
    expect(impressionObserverSpy).toHaveBeenCalledWith(placement)
    // The 0th logError call happens when the impression callback request fails due to mockReject.
    // For this test, it's sufficient to assert that we called the forceImpression function.
    expect(logErrorSpy.mock.calls[1][0]).toBe('Click callback failed for: pocket_billboard_1 with an unknown error.')
    expect(logErrorSpy.mock.calls[1][1]).toEqual({ 'errorId': 'Error', 'eventLabel': 'fetch_error', 'method': 'GET', 'path': 'https://example.com/click', 'placementId': 'pocket_billboard_1', 'type': 'recordClick.callbackResponseError' })
  })

  test('catches and logs an unknown error when the fetch fails for an unknown reason', async () => {
    const placement = {
      placementId: 'pocket_billboard_1',
      content: {
        format: 'billboard',
        url: 'https://getpocket.com/',
        callbacks: {
          click: 'https://example.com/click',
          impression: 'https://example.com/impression',
          report: 'https://example.com/report',
        },
        image_url: 'https://example.com/image',
        alt_text: 'Advertiser Name',
        block_key: '1234567890ABCDEFGHabcdefgh',
      },
    }

    fetchMock.mockReject()

    await recordClick(placement)

    expect(logInfoSpy).toHaveBeenCalled()
    expect(impressionObserverSpy).toHaveBeenCalledWith(placement)
    // The 0th logError call happens when the impression callback request fails due to mockReject.
    // For this test, it's sufficient to assert that we called the forceImpression function.
    expect(logErrorSpy.mock.calls[1][0]).toBe('Click callback failed for: pocket_billboard_1 with an unknown error.')
    expect(logErrorSpy.mock.calls[1][1]).toEqual({ 'errorId': 'Unknown', 'eventLabel': 'fetch_error', 'method': 'GET', 'path': 'https://example.com/click', 'placementId': 'pocket_billboard_1', 'type': 'recordClick.callbackResponseError' })
  })

  test('successfully sends a request to the click callback', async () => {
    const placement = {
      placementId: 'pocket_billboard_1',
      content: {
        format: 'billboard',
        url: 'https://getpocket.com/',
        callbacks: {
          click: 'https://example.com/click',
          impression: 'https://example.com/impression',
          report: 'https://example.com/report',
        },
        image_url: 'https://example.com/image',
        alt_text: 'Advertiser Name',
        block_key: '1234567890ABCDEFGHabcdefgh',
      },
    }

    fetchMock.mockResponse(async () => ({}))

    await recordClick(placement)

    expect(logInfoSpy).toHaveBeenCalled()
    expect(impressionObserverSpy).toHaveBeenCalledWith(placement)
    expect(logErrorSpy).not.toHaveBeenCalled()
  })

  test('recordClick exits early if the ', async () => {
    const placement = {
      placementId: 'pocket_billboard_1',
      content: {
        format: 'billboard',
        url: 'https://getpocket.com/',
        callbacks: {
          click: 'https://example.com/click',
          impression: 'https://example.com/impression',
          report: 'https://example.com/report',
        },
        image_url: 'https://example.com/image',
        alt_text: 'Advertiser Name',
        block_key: '1234567890ABCDEFGHabcdefgh',
      },
    }

    fetchMock.mockResponse(async () => ({}))

    await recordClick(placement)

    expect(impressionObserverSpy).toHaveBeenCalledWith(placement)
    expect(logErrorSpy).not.toHaveBeenCalled()
  })
})
