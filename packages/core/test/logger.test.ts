import { SeverityLevel } from "../src/instrument"
import { DefaultLogger, LoggerLevel } from "../src/logger"

const TEST_LOG_MESSAGE = "Test log message"
const TEST_INFO_MESSAGE = "Test info message"
const TEST_WARN_MESSAGE = "Test warn message"
const TEST_ERROR_MESSAGE = "Test error message"
const TEST_DEBUG_MESSAGE = "Test debug message"

describe("core/logger.ts DefaultLogger", () => {
  const fetchSpy = jest.spyOn(globalThis, "fetch")

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("filters out None log level correctly", () => {
    const consoleLogSpy = jest.spyOn(globalThis.console, "log")
    const consolInfoSpy = jest.spyOn(globalThis.console, "info")
    const consoleWarnSpy = jest.spyOn(globalThis.console, "warn")
    const consoleErrorSpy = jest.spyOn(globalThis.console, "error")
    const consoleDebugSpy = jest.spyOn(globalThis.console, "debug")

    const logger = new DefaultLogger({ name: "test-error", level: LoggerLevel.None, emitLogs: false })

    logger.error(TEST_ERROR_MESSAGE)
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(TEST_ERROR_MESSAGE)
    logger.warn(TEST_WARN_MESSAGE)
    expect(consoleWarnSpy).not.toHaveBeenCalledWith(TEST_WARN_MESSAGE)
    logger.info(TEST_INFO_MESSAGE)
    expect(consolInfoSpy).not.toHaveBeenCalledWith(TEST_INFO_MESSAGE)
    logger.log(TEST_LOG_MESSAGE)
    expect(consoleLogSpy).not.toHaveBeenCalledWith(TEST_LOG_MESSAGE)
    logger.debug(TEST_DEBUG_MESSAGE)
    expect(consoleDebugSpy).not.toHaveBeenCalledWith(TEST_DEBUG_MESSAGE)
  })

  test("filters out Error log level correctly", () => {
    const consoleLogSpy = jest.spyOn(globalThis.console, "log")
    const consolInfoSpy = jest.spyOn(globalThis.console, "info")
    const consoleWarnSpy = jest.spyOn(globalThis.console, "warn")
    const consoleErrorSpy = jest.spyOn(globalThis.console, "error")
    const consoleDebugSpy = jest.spyOn(globalThis.console, "debug")

    const logger = new DefaultLogger({ name: "test-error", level: LoggerLevel.Error, emitLogs: false })

    logger.error(TEST_ERROR_MESSAGE)
    expect(consoleErrorSpy).toHaveBeenCalledWith(TEST_ERROR_MESSAGE)
    logger.warn(TEST_WARN_MESSAGE)
    expect(consoleWarnSpy).not.toHaveBeenCalledWith(TEST_WARN_MESSAGE)
    logger.info(TEST_INFO_MESSAGE)
    expect(consolInfoSpy).not.toHaveBeenCalledWith(TEST_INFO_MESSAGE)
    logger.log(TEST_LOG_MESSAGE)
    expect(consoleLogSpy).not.toHaveBeenCalledWith(TEST_LOG_MESSAGE)
    logger.debug(TEST_DEBUG_MESSAGE)
    expect(consoleDebugSpy).not.toHaveBeenCalledWith(TEST_DEBUG_MESSAGE)
  })

  test("filters out Warn log level correctly", () => {
    const consoleLogSpy = jest.spyOn(globalThis.console, "log")
    const consolInfoSpy = jest.spyOn(globalThis.console, "info")
    const consoleWarnSpy = jest.spyOn(globalThis.console, "warn")
    const consoleErrorSpy = jest.spyOn(globalThis.console, "error")
    const consoleDebugSpy = jest.spyOn(globalThis.console, "debug")

    const logger = new DefaultLogger({ name: "test-warn", level: LoggerLevel.Warn, emitLogs: false })

    logger.error(TEST_ERROR_MESSAGE)
    expect(consoleErrorSpy).toHaveBeenCalledWith(TEST_ERROR_MESSAGE)
    logger.warn(TEST_WARN_MESSAGE)
    expect(consoleWarnSpy).toHaveBeenCalledWith(TEST_WARN_MESSAGE)
    logger.info(TEST_INFO_MESSAGE)
    expect(consolInfoSpy).not.toHaveBeenCalledWith(TEST_INFO_MESSAGE)
    logger.log(TEST_LOG_MESSAGE)
    expect(consoleLogSpy).not.toHaveBeenCalledWith(TEST_LOG_MESSAGE)
    logger.debug(TEST_DEBUG_MESSAGE)
    expect(consoleDebugSpy).not.toHaveBeenCalledWith(TEST_DEBUG_MESSAGE)
  })

  test("filters out Info log level correctly", () => {
    const consoleLogSpy = jest.spyOn(globalThis.console, "log")
    const consolInfoSpy = jest.spyOn(globalThis.console, "info")
    const consoleWarnSpy = jest.spyOn(globalThis.console, "warn")
    const consoleErrorSpy = jest.spyOn(globalThis.console, "error")
    const consoleDebugSpy = jest.spyOn(globalThis.console, "debug")

    const logger = new DefaultLogger({ name: "test-info", level: LoggerLevel.Info, emitLogs: false })

    logger.error(TEST_ERROR_MESSAGE)
    expect(consoleErrorSpy).toHaveBeenCalledWith(TEST_ERROR_MESSAGE)
    logger.warn(TEST_WARN_MESSAGE)
    expect(consoleWarnSpy).toHaveBeenCalledWith(TEST_WARN_MESSAGE)
    logger.info(TEST_INFO_MESSAGE)
    expect(consolInfoSpy).toHaveBeenCalledWith(TEST_INFO_MESSAGE)
    logger.log(TEST_LOG_MESSAGE)
    expect(consoleLogSpy).toHaveBeenCalledWith(TEST_LOG_MESSAGE)
    logger.debug(TEST_DEBUG_MESSAGE)
    expect(consoleDebugSpy).not.toHaveBeenCalledWith(TEST_DEBUG_MESSAGE)
  })

  test("filters out Debug log level correctly", () => {
    const consoleLogSpy = jest.spyOn(globalThis.console, "log")
    const consolInfoSpy = jest.spyOn(globalThis.console, "info")
    const consoleWarnSpy = jest.spyOn(globalThis.console, "warn")
    const consoleErrorSpy = jest.spyOn(globalThis.console, "error")
    const consoleDebugSpy = jest.spyOn(globalThis.console, "debug")

    const logger = new DefaultLogger({ name: "test-debug", level: LoggerLevel.Debug, emitLogs: false })

    logger.error(TEST_ERROR_MESSAGE)
    expect(consoleErrorSpy).toHaveBeenCalledWith(TEST_ERROR_MESSAGE)
    logger.warn(TEST_WARN_MESSAGE)
    expect(consoleWarnSpy).toHaveBeenCalledWith(TEST_WARN_MESSAGE)
    logger.info(TEST_INFO_MESSAGE)
    expect(consolInfoSpy).toHaveBeenCalledWith(TEST_INFO_MESSAGE)
    logger.log(TEST_LOG_MESSAGE)
    expect(consoleLogSpy).toHaveBeenCalledWith(TEST_LOG_MESSAGE)
    logger.debug(TEST_DEBUG_MESSAGE)
    expect(consoleDebugSpy).toHaveBeenCalledWith(TEST_DEBUG_MESSAGE)
  })

  test("correctly emits logs and silences console logs when asked", () => {
    const consoleLogSpy = jest.spyOn(globalThis.console, "log")
    const consolInfoSpy = jest.spyOn(globalThis.console, "info")
    const consoleWarnSpy = jest.spyOn(globalThis.console, "warn")
    const consoleErrorSpy = jest.spyOn(globalThis.console, "error")
    const consoleDebugSpy = jest.spyOn(globalThis.console, "debug")

    const logger = new DefaultLogger({ name: "test-debug", level: LoggerLevel.Debug, logToConsole: false, emitLogs: true })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emitLog = jest.spyOn(logger as any, "emitLog")

    logger.error(TEST_ERROR_MESSAGE)
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(TEST_ERROR_MESSAGE)
    expect(emitLog).toHaveBeenCalledWith(TEST_ERROR_MESSAGE, SeverityLevel.Error, undefined)
    expect(fetchSpy).not.toHaveBeenCalled()
    logger.warn(TEST_WARN_MESSAGE)
    expect(consoleWarnSpy).not.toHaveBeenCalledWith(TEST_WARN_MESSAGE)
    expect(emitLog).toHaveBeenCalledWith(TEST_WARN_MESSAGE, SeverityLevel.Warning, undefined)
    expect(fetchSpy).not.toHaveBeenCalled()
    logger.info(TEST_INFO_MESSAGE)
    expect(consolInfoSpy).not.toHaveBeenCalledWith(TEST_INFO_MESSAGE)
    expect(emitLog).toHaveBeenCalledWith(TEST_INFO_MESSAGE, SeverityLevel.Info, undefined)
    expect(fetchSpy).not.toHaveBeenCalled()
    logger.log(TEST_LOG_MESSAGE)
    expect(consoleLogSpy).not.toHaveBeenCalledWith(TEST_LOG_MESSAGE)
    expect(emitLog).toHaveBeenCalledWith(TEST_LOG_MESSAGE, SeverityLevel.Info, undefined)
    logger.debug(TEST_DEBUG_MESSAGE)
    expect(consoleDebugSpy).not.toHaveBeenCalledWith(TEST_DEBUG_MESSAGE)
    expect(emitLog).toHaveBeenCalledWith(TEST_DEBUG_MESSAGE, SeverityLevel.Debug, undefined)
  })
})
