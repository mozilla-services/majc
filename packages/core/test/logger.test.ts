import { SeverityLevel } from '../src/instrument'
import { DefaultLogger, LoggerLevel } from '../src/logger'

const TEST_LOG_MESSAGE = 'Test log message'
const TEST_INFO_MESSAGE = 'Test info message'
const TEST_WARN_MESSAGE = 'Test warn message'
const TEST_ERROR_MESSAGE = 'Test error message'
const TEST_DEBUG_MESSAGE = 'Test debug message'

describe('core/logger.ts', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('DefaultLogger filters out None log level correctly', () => {
    const consoleLogMock = jest.spyOn(globalThis.console, 'log')
    const consoleInfoMock = jest.spyOn(globalThis.console, 'info')
    const consoleWarnMock = jest.spyOn(globalThis.console, 'warn')
    const consoleErrorMock = jest.spyOn(globalThis.console, 'error')
    const consoleDebugMock = jest.spyOn(globalThis.console, 'debug')

    const logger = new DefaultLogger({ name: 'test-error', level: LoggerLevel.None, emitLogs: false })

    logger.error(TEST_ERROR_MESSAGE)
    expect(consoleErrorMock).not.toHaveBeenCalledWith(TEST_ERROR_MESSAGE)
    logger.warn(TEST_WARN_MESSAGE)
    expect(consoleWarnMock).not.toHaveBeenCalledWith(TEST_WARN_MESSAGE)
    logger.info(TEST_INFO_MESSAGE)
    expect(consoleInfoMock).not.toHaveBeenCalledWith(TEST_INFO_MESSAGE)
    logger.log(TEST_LOG_MESSAGE)
    expect(consoleLogMock).not.toHaveBeenCalledWith(TEST_LOG_MESSAGE)
    logger.debug(TEST_DEBUG_MESSAGE)
    expect(consoleDebugMock).not.toHaveBeenCalledWith(TEST_DEBUG_MESSAGE)
  })

  test('DefaultLogger filters out Error log level correctly', () => {
    const consoleLogMock = jest.spyOn(globalThis.console, 'log')
    const consoleInfoMock = jest.spyOn(globalThis.console, 'info')
    const consoleWarnMock = jest.spyOn(globalThis.console, 'warn')
    const consoleErrorMock = jest.spyOn(globalThis.console, 'error')
    const consoleDebugMock = jest.spyOn(globalThis.console, 'debug')

    const logger = new DefaultLogger({ name: 'test-error', level: LoggerLevel.Error, emitLogs: false })

    logger.error(TEST_ERROR_MESSAGE)
    expect(consoleErrorMock).toHaveBeenCalledWith(TEST_ERROR_MESSAGE)
    logger.warn(TEST_WARN_MESSAGE)
    expect(consoleWarnMock).not.toHaveBeenCalledWith(TEST_WARN_MESSAGE)
    logger.info(TEST_INFO_MESSAGE)
    expect(consoleInfoMock).not.toHaveBeenCalledWith(TEST_INFO_MESSAGE)
    logger.log(TEST_LOG_MESSAGE)
    expect(consoleLogMock).not.toHaveBeenCalledWith(TEST_LOG_MESSAGE)
    logger.debug(TEST_DEBUG_MESSAGE)
    expect(consoleDebugMock).not.toHaveBeenCalledWith(TEST_DEBUG_MESSAGE)
  })

  test('DefaultLogger filters out Warn log level correctly', () => {
    const consoleLogMock = jest.spyOn(globalThis.console, 'log')
    const consoleInfoMock = jest.spyOn(globalThis.console, 'info')
    const consoleWarnMock = jest.spyOn(globalThis.console, 'warn')
    const consoleErrorMock = jest.spyOn(globalThis.console, 'error')
    const consoleDebugMock = jest.spyOn(globalThis.console, 'debug')

    const logger = new DefaultLogger({ name: 'test-warn', level: LoggerLevel.Warn, emitLogs: false })

    logger.error(TEST_ERROR_MESSAGE)
    expect(consoleErrorMock).toHaveBeenCalledWith(TEST_ERROR_MESSAGE)
    logger.warn(TEST_WARN_MESSAGE)
    expect(consoleWarnMock).toHaveBeenCalledWith(TEST_WARN_MESSAGE)
    logger.info(TEST_INFO_MESSAGE)
    expect(consoleInfoMock).not.toHaveBeenCalledWith(TEST_INFO_MESSAGE)
    logger.log(TEST_LOG_MESSAGE)
    expect(consoleLogMock).not.toHaveBeenCalledWith(TEST_LOG_MESSAGE)
    logger.debug(TEST_DEBUG_MESSAGE)
    expect(consoleDebugMock).not.toHaveBeenCalledWith(TEST_DEBUG_MESSAGE)
  })

  test('DefaultLogger filters out Info log level correctly', () => {
    const consoleLogMock = jest.spyOn(globalThis.console, 'log')
    const consoleInfoMock = jest.spyOn(globalThis.console, 'info')
    const consoleWarnMock = jest.spyOn(globalThis.console, 'warn')
    const consoleErrorMock = jest.spyOn(globalThis.console, 'error')
    const consoleDebugMock = jest.spyOn(globalThis.console, 'debug')

    const logger = new DefaultLogger({ name: 'test-info', level: LoggerLevel.Info, emitLogs: false })

    logger.error(TEST_ERROR_MESSAGE)
    expect(consoleErrorMock).toHaveBeenCalledWith(TEST_ERROR_MESSAGE)
    logger.warn(TEST_WARN_MESSAGE)
    expect(consoleWarnMock).toHaveBeenCalledWith(TEST_WARN_MESSAGE)
    logger.info(TEST_INFO_MESSAGE)
    expect(consoleInfoMock).toHaveBeenCalledWith(TEST_INFO_MESSAGE)
    logger.log(TEST_LOG_MESSAGE)
    expect(consoleLogMock).toHaveBeenCalledWith(TEST_LOG_MESSAGE)
    logger.debug(TEST_DEBUG_MESSAGE)
    expect(consoleDebugMock).not.toHaveBeenCalledWith(TEST_DEBUG_MESSAGE)
  })

  test('DefaultLogger filters out Debug log level correctly', () => {
    const consoleLogMock = jest.spyOn(globalThis.console, 'log')
    const consoleInfoMock = jest.spyOn(globalThis.console, 'info')
    const consoleWarnMock = jest.spyOn(globalThis.console, 'warn')
    const consoleErrorMock = jest.spyOn(globalThis.console, 'error')
    const consoleDebugMock = jest.spyOn(globalThis.console, 'debug')

    const logger = new DefaultLogger({ name: 'test-debug', level: LoggerLevel.Debug, emitLogs: false })

    logger.error(TEST_ERROR_MESSAGE)
    expect(consoleErrorMock).toHaveBeenCalledWith(TEST_ERROR_MESSAGE)
    logger.warn(TEST_WARN_MESSAGE)
    expect(consoleWarnMock).toHaveBeenCalledWith(TEST_WARN_MESSAGE)
    logger.info(TEST_INFO_MESSAGE)
    expect(consoleInfoMock).toHaveBeenCalledWith(TEST_INFO_MESSAGE)
    logger.log(TEST_LOG_MESSAGE)
    expect(consoleLogMock).toHaveBeenCalledWith(TEST_LOG_MESSAGE)
    logger.debug(TEST_DEBUG_MESSAGE)
    expect(consoleDebugMock).toHaveBeenCalledWith(TEST_DEBUG_MESSAGE)
  })

  test('DefaultLogger correctly emits logs and silences console logs when asked', () => {
    const consoleLogMock = jest.spyOn(globalThis.console, 'log')
    const consoleInfoMock = jest.spyOn(globalThis.console, 'info')
    const consoleWarnMock = jest.spyOn(globalThis.console, 'warn')
    const consoleErrorMock = jest.spyOn(globalThis.console, 'error')
    const consoleDebugMock = jest.spyOn(globalThis.console, 'debug')

    const logger = new DefaultLogger({ name: 'test-debug', level: LoggerLevel.Debug, logToConsole: false, emitLogs: true })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emitLog = jest.spyOn(logger as any, 'emitLog')

    logger.error(TEST_ERROR_MESSAGE)
    expect(consoleErrorMock).not.toHaveBeenCalledWith(TEST_ERROR_MESSAGE)
    expect(emitLog).toHaveBeenCalledWith(TEST_ERROR_MESSAGE, SeverityLevel.Error, undefined)
    logger.warn(TEST_WARN_MESSAGE)
    expect(consoleWarnMock).not.toHaveBeenCalledWith(TEST_WARN_MESSAGE)
    expect(emitLog).toHaveBeenCalledWith(TEST_WARN_MESSAGE, SeverityLevel.Warning, undefined)
    logger.info(TEST_INFO_MESSAGE)
    expect(consoleInfoMock).not.toHaveBeenCalledWith(TEST_INFO_MESSAGE)
    expect(emitLog).toHaveBeenCalledWith(TEST_INFO_MESSAGE, SeverityLevel.Info, undefined)
    logger.log(TEST_LOG_MESSAGE)
    expect(consoleLogMock).not.toHaveBeenCalledWith(TEST_LOG_MESSAGE)
    expect(emitLog).toHaveBeenCalledWith(TEST_LOG_MESSAGE, SeverityLevel.Info, undefined)
    logger.debug(TEST_DEBUG_MESSAGE)
    expect(consoleDebugMock).not.toHaveBeenCalledWith(TEST_DEBUG_MESSAGE)
    expect(emitLog).toHaveBeenCalledWith(TEST_DEBUG_MESSAGE, SeverityLevel.Debug, undefined)
  })
})
