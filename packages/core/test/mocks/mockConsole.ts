/* eslint @typescript-eslint/no-unused-vars: 0 */

const nativeConsole = globalThis.console

class MockConsole implements Partial<Console> {
  get nativeConsole() {
    return nativeConsole
  }

  // @ts-expect-error Mocked function is intentionally a NO-OP, so unused arguments are expected
  debug(_message?: unknown, ..._optionalParams?: unknown[]) {}
  // @ts-expect-error Mocked function is intentionally a NO-OP, so unused arguments are expected
  error(_message?: unknown, ..._optionalParams?: unknown[]) {}
  // @ts-expect-error Mocked function is intentionally a NO-OP, so unused arguments are expected
  info(_message?: unknown, ..._optionalParams?: unknown[]) {}
  // @ts-expect-error Mocked function is intentionally a NO-OP, so unused arguments are expected
  log(_message?: unknown, ..._optionalParams?: unknown[]) {}
  // @ts-expect-error Mocked function is intentionally a NO-OP, so unused arguments are expected
  warn(_message?: unknown, ..._optionalParams?: unknown[]) {}
}

export default new MockConsole()
