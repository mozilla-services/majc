interface mockIntersectionObserverEntry {
  intersectionRatio: number
  target: Element
}

export class MockIntersectionObserver implements IntersectionObserver {
  public callback: IntersectionObserverCallback
  public thresholds: number[]
  public observedElements: Map<Element, mockIntersectionObserverEntry> = new Map()
  root = null
  rootMargin = ''

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback
    if (options?.threshold) {
      this.thresholds = options.threshold as number[]
    }
    else {
      this.thresholds = []
    }
  }

  disconnect() {
    return null
  }

  observe(element: Element) {
    this.observedElements.set(element, {
      intersectionRatio: 0.0,
      target: element,
    })
  }

  takeRecords() {
    return []
  }

  unobserve(element: Element) {
    this.observedElements.delete(element)
  }

  public mockForceCallback(newElementIntersectionRatios: Map<Element, number>) {
    /**
     * This is a custom method for our MockIntersectionObserver that allows us to force the intersectionCallback to be called
     * with explicit ratios for each element being observed.
     *
     * This is meant to mock the behavior of scrolling something into view.
    */
    for (const [el, intersectionRatio] of newElementIntersectionRatios) {
      this.observedElements.set(el, {
        intersectionRatio: intersectionRatio,
        target: el,
      })
    }
    this.callback([...this.observedElements.values()] as IntersectionObserverEntry[], this)
  }
}
