/* eslint @stylistic/quote-props: 0 */

import fetchMock from 'jest-fetch-mock'
import { tick } from '@/jest.setup'
import { renderPlacement } from '../src/display'

describe('iife/display.ts', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renderPlacement logs an error and fails when an invalid element ID is passed', async () => {
    const placementConfig = {
      placementId: 'pocket_billboard_1',
      iabContentCategoryIds: ['IAB1'],
    }
    const consoleErrorMock = jest.spyOn(globalThis.console, 'error')

    await renderPlacement('invalid-element-id', placementConfig)
    await tick()
    expect(consoleErrorMock).toHaveBeenLastCalledWith('Unable to render placement; No element found with ID invalid-element-id')
  })

  test('renderPlacement logs an error and fails when an invalid element is passed', async () => {
    const placementConfig = {
      placementId: 'pocket_billboard_1',
      iabContentCategoryIds: ['IAB1'],
    }
    const consoleErrorMock = jest.spyOn(globalThis.console, 'error')

    await renderPlacement(undefined as unknown as HTMLElement, placementConfig)
    await tick()
    expect(consoleErrorMock).toHaveBeenLastCalledWith('Unable to render placement; Invalid element')
  })

  test('renderPlacement throws an error when the fetch fails', async () => {
    const placementElement = document.createElement('div')
    const placementConfig = {
      placementId: 'pocket_billboard_1',
      iabContentCategoryIds: ['IAB1'],
    }
    const consoleErrorMock = jest.spyOn(globalThis.console, 'error')
    fetchMock.mockRejectOnce(new Error('test-error'))

    await renderPlacement(placementElement, placementConfig)
    await tick()
    expect(consoleErrorMock).toHaveBeenLastCalledWith('Unable to fetch ads; test-error')
  })

  test('renderPlacement produces the correct DOM markup for the requested ad placement', async () => {
    const placementElement = document.createElement('div')
    const placementConfig = {
      placementId: 'pocket_billboard_1',
      iabContentCategoryIds: ['IAB1'],
    }
    fetchMock.mockResponseOnce(async () => ({
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'pocket_billboard_1': [
          {
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
        ],
      }),
    }))

    await renderPlacement(placementElement, placementConfig)
    await tick()

    const link = placementElement.querySelector<HTMLAnchorElement>('.moz-ads-placement-link[data-placement-id="pocket_billboard_1"]')
    expect(link).toBeInstanceOf(HTMLAnchorElement)
    expect(link?.href).toEqual('https://getpocket.com/')
    const img = link?.querySelector<HTMLImageElement>('.moz-ads-placement-img[data-placement-id="pocket_billboard_1"]')
    expect(img).toBeInstanceOf(HTMLImageElement)
    expect(img?.alt).toEqual('Advertiser Name')
    expect(img?.src).toEqual('http://example.com/image')
    img?.dispatchEvent(new Event('load'))
    const reportButton = link?.querySelector<HTMLButtonElement>('.moz-ads-placement-report-button')
    expect(reportButton).toBeInstanceOf(HTMLButtonElement)
    expect(reportButton?.title).toEqual('Report ad')
    fetchMock.mockResponseOnce(async () => ({}))
    link?.dispatchEvent(new Event('click'))
    expect(fetchMock.mock.lastCall?.[0]).toEqual('http://example.com/click')
    expect(fetchMock.mock.lastCall?.[1]).toEqual({ keepalive: true })
  })
})
