export const GLOBAL_UTC_MS = 1741197178005

export class MockDate {
  public static currentTimeMs = GLOBAL_UTC_MS
  public static now() {
    return MockDate.currentTimeMs
  }

  public getTime() {
    return MockDate.currentTimeMs
  }
}
