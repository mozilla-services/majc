class MockStorage implements Storage {
  private _store: Record<string, string> = {}

  get length(): number {
    return Object.keys(this._store).length
  }

  clear(): void {
    this._store = {}
  }

  getItem(key: string): string | null {
    return this._store[key] ?? null
  }

  key(index: number): string | null {
    return Object.keys(this._store)[index] ?? null
  }

  setItem(key: string, value: string): void {
    this._store[key] = value
  }

  removeItem(key: string): void {
    delete this._store[key]
  }
}

export const mockLocalStorage: MockStorage = new MockStorage()
export const mockSessionStorage: MockStorage = new MockStorage()
