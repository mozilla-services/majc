import fetchMock from 'jest-fetch-mock'
import { tick } from '@/jest.setup'
import { MOCK_AD_PLACEMENTS } from './mocks/mockAdPlacements'
import { MockIntersectionObserver } from './mocks/mockIntersectionObserver'
import { DefaultMozAdsImpressionObserver } from '../src/impressions'

describe('core/impresssions.ts', () => {
  let defaultObserver: DefaultMozAdsImpressionObserver
  let placementElement1: HTMLElement
  let placementElement2: HTMLElement
  let invalidPlacementElement: HTMLElement

  beforeEach(() => {
    placementElement1 = document.createElement('img')
    placementElement2 = document.createElement('img')
    invalidPlacementElement = document.createElement('img')
    placementElement1.className = 'moz-ads-placement-img'
    placementElement2.className = 'moz-ads-placement-img'
    placementElement1.dataset.placementId = 'pocket_billboard_1'
    placementElement2.dataset.placementId = 'pocket_billboard_2'
    globalThis.IntersectionObserver = MockIntersectionObserver
    defaultObserver = new DefaultMozAdsImpressionObserver()

    document.body.appendChild(placementElement1)
    document.body.appendChild(placementElement2)
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllMocks()
    document.body.innerHTML = ''
    document.head.innerHTML = ''
    jest.useRealTimers()
  })

  test('forceRecordImpression logs an error when the impression callback URL fetch fails', async () => {
    jest.useRealTimers()

    const consoleErrorMock = jest.spyOn(globalThis.console, 'error')
    fetchMock.mockResponse(async () => ({
      init: {
        status: 500,
      },
    }))

    defaultObserver.forceRecordImpression({
      placementId: 'pocket_billboard_1',
      content: {
        callbacks: {
          click: 'invalid-click-callback-url',
          impression: 'invalid-impression-callback-url',
        },
      },
    })

    expect(fetchMock.mock.lastCall?.[0]).toEqual('invalid-impression-callback-url')
    expect(fetchMock.mock.lastCall?.[1]).toEqual({ keepalive: true })

    await tick()

    expect(consoleErrorMock).toHaveBeenLastCalledWith('Impression callback returned a non-200 for placement: pocket_billboard_1')
  })

  test('ads are observed when asked', () => {
    const observerSpy = jest.spyOn(defaultObserver.intersectionObserver!, 'observe')
    defaultObserver.observe(MOCK_AD_PLACEMENTS['pocket_billboard_1'])
    defaultObserver.observe(MOCK_AD_PLACEMENTS['pocket_billboard_2'])
    defaultObserver.observe(MOCK_AD_PLACEMENTS['invalid_placement_1'])
    expect(observerSpy).toHaveBeenCalledWith(placementElement1)
    expect(observerSpy).toHaveBeenCalledWith(placementElement2)
    expect(observerSpy).toHaveBeenCalledTimes(2)
  })

  test('unseen element successfully becomes in-view when above threshold', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recordImpressionSpy = jest.spyOn(defaultObserver as any, 'recordImpression')
    const unobserveSpy = jest.spyOn(defaultObserver.intersectionObserver!, 'unobserve')
    defaultObserver.observe(MOCK_AD_PLACEMENTS['pocket_billboard_1'])
    defaultObserver.observe(MOCK_AD_PLACEMENTS['pocket_billboard_2'])
    expect(defaultObserver.impressionTracker['pocket_billboard_1'].viewStatus).toEqual('unseen')
    expect(defaultObserver.impressionTracker['pocket_billboard_2'].viewStatus).toEqual('unseen')
    const mockIntersectionObserver = defaultObserver.intersectionObserver as MockIntersectionObserver
    const newElementIntersectionRatios = new Map([
      [placementElement1, 0.5],
      [placementElement2, 0.0],
    ])
    mockIntersectionObserver.mockForceCallback(newElementIntersectionRatios)

    // Verify statuses are as expected
    expect(defaultObserver.impressionTracker['pocket_billboard_1'].viewStatus).toEqual('in-view')
    expect(defaultObserver.impressionTracker['pocket_billboard_2'].viewStatus).toEqual('unseen')

    // Verify in-view elements are still tracked
    expect((defaultObserver.intersectionObserver as MockIntersectionObserver).observedElements.get(placementElement1)).not.toBeNull()
    expect((defaultObserver.intersectionObserver as MockIntersectionObserver).observedElements.get(placementElement2)).not.toBeNull()

    // Verify no impressions have been recorded and nothing has been unobserved
    expect(recordImpressionSpy).toHaveBeenCalledTimes(0)
    expect(unobserveSpy).toHaveBeenCalledTimes(0)
  })

  test('unseen element remains unseen when out of threshold', () => {
    defaultObserver.observe(MOCK_AD_PLACEMENTS['pocket_billboard_1'])
    defaultObserver.observe(MOCK_AD_PLACEMENTS['pocket_billboard_2'])
    expect(defaultObserver.impressionTracker['pocket_billboard_1'].viewStatus).toEqual('unseen')
    expect(defaultObserver.impressionTracker['pocket_billboard_2'].viewStatus).toEqual('unseen')
    const mockIntersectionObserver = defaultObserver.intersectionObserver as MockIntersectionObserver
    const newElementIntersectionRatios = new Map([
      [placementElement1, 0.2],
      [placementElement2, 0.1],
    ])
    mockIntersectionObserver.mockForceCallback(newElementIntersectionRatios)
    expect(defaultObserver.impressionTracker['pocket_billboard_1'].viewStatus).toEqual('unseen')
    expect(defaultObserver.impressionTracker['pocket_billboard_2'].viewStatus).toEqual('unseen')
  })

  test('ignore invalid entries observed by the IntersectionObserver', async () => {
    defaultObserver.observe(MOCK_AD_PLACEMENTS['pocket_billboard_1'])
    defaultObserver.observe(MOCK_AD_PLACEMENTS['pocket_billboard_2'])
    expect(defaultObserver.impressionTracker['pocket_billboard_1'].viewStatus).toEqual('unseen')
    expect(defaultObserver.impressionTracker['pocket_billboard_2'].viewStatus).toEqual('unseen')
    delete defaultObserver.impressionTracker['pocket_billboard_1']
    const mockIntersectionObserver = defaultObserver.intersectionObserver as MockIntersectionObserver
    const newElementIntersectionRatios = new Map([
      [placementElement1, 0.1],
      [placementElement2, 0.5],
      [invalidPlacementElement, 1.0],
    ])
    mockIntersectionObserver.mockForceCallback(newElementIntersectionRatios)
    expect(defaultObserver.impressionTracker['pocket_billboard_2'].viewStatus).toEqual('in-view')
  })

  test('in-view element becomes viewed when remaining above threshold', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recordImpressionSpy = jest.spyOn(defaultObserver as any, 'recordImpression')
    const unobserveSpy = jest.spyOn(defaultObserver.intersectionObserver!, 'unobserve')
    defaultObserver.observe(MOCK_AD_PLACEMENTS['pocket_billboard_1'])
    defaultObserver.observe(MOCK_AD_PLACEMENTS['pocket_billboard_2'])
    expect(defaultObserver.impressionTracker['pocket_billboard_1'].viewStatus).toEqual('unseen')
    expect(defaultObserver.impressionTracker['pocket_billboard_2'].viewStatus).toEqual('unseen')

    const mockIntersectionObserver = defaultObserver.intersectionObserver as MockIntersectionObserver
    const newElementIntersectionRatios = new Map([
      [placementElement1, 0.5],
      [placementElement2, 0.0],
    ])

    mockIntersectionObserver.mockForceCallback(newElementIntersectionRatios)

    // Redudant, but we again verify unseen -> in-view is still successful for this test to continue.
    expect(defaultObserver.impressionTracker['pocket_billboard_1'].viewStatus).toEqual('in-view')
    expect(defaultObserver.impressionTracker['pocket_billboard_2'].viewStatus).toEqual('unseen')

    // Forces all mocked timeouts to fire as if the user had viewed the user had viewed the div for the expected time
    jest.runAllTimers()

    // Verify statuses change to expected values
    expect(defaultObserver.impressionTracker['pocket_billboard_1'].viewStatus).toEqual('viewed')
    expect(defaultObserver.impressionTracker['pocket_billboard_2'].viewStatus).toEqual('unseen')

    // Verify expected number of impressions are recorded
    expect(recordImpressionSpy).toHaveBeenCalledTimes(1)

    // Verify 'viewed' elements are no longer tracked
    expect((defaultObserver.intersectionObserver as MockIntersectionObserver).observedElements.get(placementElement1)).toBeUndefined()
    expect((defaultObserver.intersectionObserver as MockIntersectionObserver).observedElements.get(placementElement2)).not.toBeNull()
    expect(unobserveSpy).toHaveBeenCalledTimes(1)
  })

  test('in-view element becomes unseen when going out of threshold', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recordImpressionSpy = jest.spyOn(defaultObserver as any, 'recordImpression')
    defaultObserver.observe(MOCK_AD_PLACEMENTS['pocket_billboard_1'])
    defaultObserver.observe(MOCK_AD_PLACEMENTS['pocket_billboard_2'])
    expect(defaultObserver.impressionTracker['pocket_billboard_1'].viewStatus).toEqual('unseen')
    expect(defaultObserver.impressionTracker['pocket_billboard_2'].viewStatus).toEqual('unseen')

    const mockIntersectionObserver = defaultObserver.intersectionObserver as MockIntersectionObserver
    const newElementIntersectionRatios = new Map([
      [placementElement1, 0.5],
      [placementElement2, 0.0],
    ])

    mockIntersectionObserver.mockForceCallback(newElementIntersectionRatios)

    expect(defaultObserver.impressionTracker['pocket_billboard_1'].viewStatus).toEqual('in-view')
    expect(defaultObserver.impressionTracker['pocket_billboard_2'].viewStatus).toEqual('unseen')

    const clearTimeoutSpy = jest.spyOn(globalThis, 'clearTimeout')
    const inViewTimeout = defaultObserver.impressionTracker['pocket_billboard_1'].timeout

    mockIntersectionObserver.mockForceCallback(new Map([
      [placementElement1, 0.2],
    ]))

    // Verify statuses return to normal
    expect(defaultObserver.impressionTracker['pocket_billboard_1'].viewStatus).toEqual('unseen')
    expect(defaultObserver.impressionTracker['pocket_billboard_2'].viewStatus).toEqual('unseen')

    // Verify no impressions are recorded
    expect(recordImpressionSpy).toHaveBeenCalledTimes(0)
    expect(clearTimeoutSpy).toHaveBeenCalledWith(inViewTimeout)
  })
})
