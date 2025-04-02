import { GLOBAL_UTC_MS, MockDate } from './mocks/mockDate'
import { INSTRUMENT_ENDPOINT } from '../src/constants'
import {
  defaultLogReporter,
  DefaultLogReporter,
  LogEmitterOptions,
  MozLogMessage,
  SeverityLevel,
} from '../src/instrument'

const TEST_LOG_MESSAGE_1 = 'TEST MESSAGE'
const TEST_LOG_MESSAGE_2 = 'TEST MESSAGE_2'
const TEST_LOG_OPTIONS_1: LogEmitterOptions = {
  type: 'fetchAds.request.error',
  eventLabel: 'fetch_error',
  logger: 'instrument.test',
  hostname: 'somehost',
  envVersion: '0.0.0',
  severity: SeverityLevel.Error,
  pid: 1,
  agent: 'testAgentName',
  errorId: 'TestLogError',
  method: 'POST',
  path: '/v1/example/api/call',
  placementId: 'pocket_billboard_1',
  lang: 'en-us',
}

const TEST_LOG_OPTIONS_2: LogEmitterOptions = {
  type: 'fetchAds.request.error',
  eventLabel: 'fetch_error',
  logger: 'instrument.test',
  hostname: 'somehost',
  envVersion: '0.0.0',
  severity: SeverityLevel.Info,
  pid: 1,
  agent: 'testAgentName',
  errorId: 'TestLogError',
  method: 'POST',
  path: '/v1/example/api/call',
  placementId: 'pocket_billboard_2',
  lang: 'en-us',
}

const EXPECTED_FORMATTED_LOG_1: MozLogMessage = {
  Timestamp: GLOBAL_UTC_MS * 1_000_000,
  Type: 'fetchAds.request.error',
  Logger: 'majc.instrument.test',
  Hostname: 'somehost',
  EnvVersion: '0.0.0',
  Severity: SeverityLevel.Error,
  Pid: 1,
  Fields: {
    agent: 'testAgentName',
    errorId: 'TestLogError',
    method: 'POST',
    msg: TEST_LOG_MESSAGE_1,
    path: '/v1/example/api/call',
    placementId: 'pocket_billboard_1',
    lang: 'en-us',
  },
}

let isBrowser = true

jest.mock('../src/constants', () => {
  const constants = jest.requireActual('../src/constants')
  return {
    __esModule: true,
    ...constants,
    get IS_BROWSER() {
      return isBrowser
    },
  }
})

describe('core/instrument.ts', () => {
  afterEach(() => {
    isBrowser = true
    defaultLogReporter.flush()
    jest.clearAllMocks()
  })

  test('DefaultLogReporter is configured properly', () => {
    const logReporter = new DefaultLogReporter({
      limiterOps: {
        dupLogTimeLimit: 111,
        dupLogCountLimit: 222,
      },
    })
    expect(logReporter.namePrefix).toEqual('majc')
    expect(logReporter.dupLogTimeLimit).toEqual(111)
    expect(logReporter.dupLogCountLimit).toEqual(222)
  })

  test('Log message is formatted correctly', () => {
    const formattedLog1 = defaultLogReporter.formatClientLog(TEST_LOG_MESSAGE_1, TEST_LOG_OPTIONS_1)
    expect(formattedLog1).toEqual(EXPECTED_FORMATTED_LOG_1)
    const formattedLog2 = defaultLogReporter.formatClientLog(TEST_LOG_MESSAGE_1)
    expect(formattedLog2).toEqual({
      EnvVersion: undefined,
      Fields: {
        agent: undefined,
        errorId: undefined,
        lang: undefined,
        method: undefined,
        msg: 'TEST MESSAGE',
        path: undefined,
        placementId: undefined,
      },
      Hostname: undefined,
      Logger: 'majc.default',
      Pid: undefined,
      Severity: undefined,
      Timestamp: GLOBAL_UTC_MS * 1_000_000,
      Type: undefined,
    })
  })

  test('emitLog does not fetch unless running in a web browser', () => {
    isBrowser = false

    const fetchSpy = jest.spyOn(globalThis, 'fetch')
    defaultLogReporter.emitLog(TEST_LOG_MESSAGE_1)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  test('emitLog sends correct fetch', () => {
    const expectedEndpoint = `${INSTRUMENT_ENDPOINT}?event=fetch_error`

    const fetchSpy = jest.spyOn(globalThis, 'fetch')
    defaultLogReporter.emitLog(TEST_LOG_MESSAGE_1, TEST_LOG_OPTIONS_1)
    expect(fetchSpy).toHaveBeenCalledWith(expectedEndpoint, { keepalive: true })
  })

  test('Log rate limiter properly limits duplicate logs', () => {
    const previousTimeLimit = defaultLogReporter.dupLogTimeLimit
    const previousCountLimit = defaultLogReporter.dupLogCountLimit

    defaultLogReporter.dupLogTimeLimit = 2
    defaultLogReporter.dupLogCountLimit = 2

    const fetchSpy = jest.spyOn(globalThis, 'fetch')
    // 3 duplicate logs and 1 unique log are sent simultaneously
    defaultLogReporter.emitLog(TEST_LOG_MESSAGE_1, TEST_LOG_OPTIONS_1) // Log type 1
    defaultLogReporter.emitLog(TEST_LOG_MESSAGE_1, TEST_LOG_OPTIONS_1)
    defaultLogReporter.emitLog(TEST_LOG_MESSAGE_1, TEST_LOG_OPTIONS_1)
    defaultLogReporter.emitLog(TEST_LOG_MESSAGE_2, TEST_LOG_OPTIONS_1) // Log type 2
    defaultLogReporter.emitLog(TEST_LOG_MESSAGE_1, TEST_LOG_OPTIONS_2) // Log type 3
    expect(fetchSpy).toHaveBeenCalledTimes(4)

    // Duplicate logs are sent after 500ms
    MockDate.currentTimeMs += 500 // Global time t+500ms
    defaultLogReporter.emitLog(TEST_LOG_MESSAGE_1, TEST_LOG_OPTIONS_1) // Log type 1
    defaultLogReporter.emitLog(TEST_LOG_MESSAGE_1, TEST_LOG_OPTIONS_1)
    defaultLogReporter.emitLog(TEST_LOG_MESSAGE_1, TEST_LOG_OPTIONS_1)
    defaultLogReporter.emitLog(TEST_LOG_MESSAGE_1, TEST_LOG_OPTIONS_1)
    expect(fetchSpy).toHaveBeenCalledTimes(4)

    // There still should be one available "count" for log type 2
    defaultLogReporter.emitLog(TEST_LOG_MESSAGE_2, TEST_LOG_OPTIONS_1) // Log type 2
    defaultLogReporter.emitLog(TEST_LOG_MESSAGE_2, TEST_LOG_OPTIONS_1)
    expect(fetchSpy).toHaveBeenCalledTimes(5)

    // Duplicate logs are sent 2.1s from the first (out of time threshold)
    MockDate.currentTimeMs += 1600 // Global time t+2100ms
    defaultLogReporter.emitLog(TEST_LOG_MESSAGE_1, TEST_LOG_OPTIONS_1) // Log type 1
    defaultLogReporter.emitLog(TEST_LOG_MESSAGE_1, TEST_LOG_OPTIONS_1)
    defaultLogReporter.emitLog(TEST_LOG_MESSAGE_2, TEST_LOG_OPTIONS_1) // Log type 2
    expect(fetchSpy).toHaveBeenCalledTimes(8)

    // A duplicate log sent again 500ms after last is still supressed
    MockDate.currentTimeMs += 500 // Global time t+2600
    defaultLogReporter.emitLog(TEST_LOG_MESSAGE_1, TEST_LOG_OPTIONS_1) // Log type 1
    expect(fetchSpy).toHaveBeenCalledTimes(8)

    defaultLogReporter.dupLogTimeLimit = previousTimeLimit
    defaultLogReporter.dupLogCountLimit = previousCountLimit
  })
},
)
