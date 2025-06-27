let shouldDispatchErrorOnNextLoad = false

export class MockHTMLImageElement {
  static dispatchErrorOnNextLoad() {
    shouldDispatchErrorOnNextLoad = true
  }

  set src(_value: string) {
    setTimeout(() => {
      if (shouldDispatchErrorOnNextLoad) {
        shouldDispatchErrorOnNextLoad = false

        this.onerror?.(new Event("error"))
        return
      }

      this.onload?.(new Event("load"))
    })
  }

  onload: ((event: Event) => void) | null = null
  onerror: ((event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error) => void) | null = null
}

export const MockImage = MockHTMLImageElement
