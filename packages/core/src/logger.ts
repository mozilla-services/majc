import { LOG_EMIT_FLAG_DEFAULT, LOG_TO_CONSOLE_FLAG_DEFAULT } from './constants'
import { defaultLogReporter, SeverityLevel } from './instrument'
import { HttpRequestMethod, LogType, TelemetryEventLabel } from './types'

export enum LoggerLevel {
  None = 0,
  Error = 1,
  Warn = 2,
  Info = 3,
  Debug = 4,
}

export interface LoggerConfig {
  name: string
  logToConsole?: boolean
  level?: LoggerLevel
  emitLogs?: boolean
}

export interface LogFields {
  type?: LogType
  eventLabel?: TelemetryEventLabel
  method?: HttpRequestMethod
  path?: string
  placementId?: string
  errorId?: string
}

export interface Logger {
  get name(): string
  get level(): LoggerLevel

  debug: (msg: string, extras?: LogFields) => void
  log: (msg: string, extras?: LogFields) => void
  info: (msg: string, extras?: LogFields) => void
  warn: (msg: string, extras?: LogFields) => void
  error: (msg: string, extras?: LogFields) => void
}

export class DefaultLogger implements Logger {
  public readonly name: string
  public readonly level: LoggerLevel
  public readonly logToConsole: boolean
  public readonly emitLogs: boolean

  constructor(config: LoggerConfig) {
    this.name = config.name
    this.level = config.level ?? LoggerLevel.Info
    this.logToConsole = config.logToConsole ?? LOG_TO_CONSOLE_FLAG_DEFAULT
    this.emitLogs = config.emitLogs ?? LOG_EMIT_FLAG_DEFAULT
  }

  debug(msg: string, extras?: LogFields) {
    if (this.level === LoggerLevel.Debug) {
      if (this.logToConsole) {
        console.debug(msg)
      }
      if (this.emitLogs) {
        this.emitLog(msg, SeverityLevel.Debug, extras)
      }
    }
  }

  log(msg: string, extras?: LogFields) {
    if (this.level >= LoggerLevel.Info) {
      if (this.logToConsole) {
        console.log(msg)
      }
      if (this.emitLogs) {
        this.emitLog(msg, SeverityLevel.Info, extras)
      }
    }
  }

  info(msg: string, extras?: LogFields) {
    if (this.level >= LoggerLevel.Info) {
      if (this.logToConsole) {
        console.info(msg)
      }
      if (this.emitLogs) {
        this.emitLog(msg, SeverityLevel.Info, extras)
      }
    }
  }

  warn(msg: string, extras?: LogFields) {
    if (this.level >= LoggerLevel.Warn) {
      if (this.logToConsole) {
        console.warn(msg)
      }
      if (this.emitLogs) {
        this.emitLog(msg, SeverityLevel.Warning, extras)
      }
    }
  }

  error(msg: string, extras?: LogFields) {
    if (this.level >= LoggerLevel.Error) {
      if (this.logToConsole) {
        console.error(msg)
      }
      if (this.emitLogs) {
        this.emitLog(msg, SeverityLevel.Error, extras)
      }
    }
  }

  private emitLog(msg: string, severityLevel: SeverityLevel, extras?: LogFields) {
    defaultLogReporter.emitLog(msg, {
      logger: this.name,
      eventLabel: extras?.eventLabel,
      hostname: globalThis.location?.hostname,
      severity: severityLevel,
      type: extras?.type,
      lang: globalThis.navigator?.language,
      method: extras?.method,
      placementId: extras?.placementId,
      errorId: extras?.errorId,
    })
  }
}
