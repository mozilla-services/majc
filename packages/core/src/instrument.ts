import packageJson from "@/package.json"
import { INSTRUMENT_ENDPOINT, IS_BROWSER } from "./constants"
import { HttpRequestMethod, LogType, TelemetryEventLabel } from "./types"

export enum SeverityLevel {
  Emergency = 0,
  Alert = 1,
  Critical = 2,
  Error = 3,
  Warning = 4,
  Notice = 5,
  Info = 6,
  Debug = 7,
}

// https://wiki.mozilla.org/Firefox/Services/Logging is used as a template with some additional fields.
export interface MozLogMessage {
  Timestamp: number // UTC Nanoseconds
  Type?: string
  Logger?: string
  Hostname?: string
  EnvVersion?: string
  Severity?: SeverityLevel
  Pid?: number
  Fields?: {
    errorId?: string
    method?: HttpRequestMethod
    msg?: string
    path?: string
    placementId?: string
    lang?: string
  }
}

export interface LogEmitterOptions {
  // Modified version of MozLogMessage for public export. Flatter structure with more consistent key naming.
  type?: LogType
  eventLabel?: TelemetryEventLabel
  logger?: string
  hostname?: string
  envVersion?: string
  severity?: SeverityLevel
  pid?: number
  errorId?: string
  method?: HttpRequestMethod
  path?: string
  placementId?: string
  lang?: string
}

export interface LogReporter {
  emitLog: (msg: string, options: LogEmitterOptions) => Promise<void>
  flush: () => void
}

export interface DefaultLogReporterConfig {
  name?: string
  defaultOptions?: LogEmitterOptions
  limiterOps?: {
    dupLogTimeLimit: number
    dupLogCountLimit: number
  }
}

export class DefaultLogReporter implements LogReporter {
  namePrefix: string
  defaultOptions: LogEmitterOptions = {}
  logLimiter: { [key: string]: { count: number, firstTs: number } } = {}
  dupLogTimeLimit: number = 2 // Represented in seconds
  dupLogCountLimit: number = 2

  constructor(config?: DefaultLogReporterConfig) {
    this.namePrefix = config?.name ? config.name : "majc"
    if (config?.defaultOptions) {
      this.defaultOptions = config?.defaultOptions
    }
    if (config?.limiterOps?.dupLogTimeLimit) {
      this.dupLogTimeLimit = config.limiterOps.dupLogTimeLimit
    }
    if (config?.limiterOps?.dupLogCountLimit) {
      this.dupLogCountLimit = config.limiterOps.dupLogCountLimit
    }
    this.emitLog(`MAJC instrumentation is alive in ${process.env.NODE_ENV}`, {
      logger: "core.instrument",
      eventLabel: "init",
      type: "logReporter.init.success",
      severity: SeverityLevel.Info,
    })
  }

  public async emitLog(msg: string, options: LogEmitterOptions = {}) {
    try {
      if (!IS_BROWSER) {
        return
      }

      if (!options.type) {
        return
      }

      if (!options.eventLabel) {
        return
      }

      const formattedLogEvent = this.formatClientLog(msg, { ...this.defaultOptions, ...options })
      const { isRateLimited } = this.handleLogRateLimit(formattedLogEvent)

      if (isRateLimited) {
        return
      }

      const logUrl = new URL(INSTRUMENT_ENDPOINT)

      if (options.eventLabel) {
        logUrl.searchParams.set("event", options.eventLabel)
        await fetch(logUrl.toString(), { keepalive: true })
      }
    }
    catch (error: unknown) {
      console.debug("Something went wrong when attempting to emit a log.", error)
    }
  }

  public flush() {
    this.logLimiter = {}
  }

  public formatClientLog(msg: string, opts?: LogEmitterOptions): MozLogMessage {
    const nowNanoseconds = Date.now() * 1_000_000
    return {
      Timestamp: nowNanoseconds,
      Type: opts?.type,
      Logger: `${this.namePrefix}.${opts?.logger ?? "default"}`,
      Hostname: opts?.hostname,
      EnvVersion: opts?.envVersion,
      Severity: opts?.severity,
      Pid: opts?.pid,
      Fields: {
        errorId: opts?.errorId,
        method: opts?.method,
        msg: msg,
        path: opts?.path,
        placementId: opts?.placementId,
        lang: opts?.lang,
      },
    }
  }

  private handleLogRateLimit(log: MozLogMessage): { isRateLimited: boolean } {
    const logKey = this.makeLogLimiterKey(log)
    if (this.logLimiter[logKey]) {
      if (log.Timestamp > (this.logLimiter[logKey].firstTs + (this.dupLogTimeLimit * 1_000_000_000))) {
        // Logs happen far enough between eachother
        this.logLimiter[logKey] = { count: 1, firstTs: log.Timestamp }

        return { isRateLimited: false }
      }
      else if (this.logLimiter[logKey].count < this.dupLogCountLimit) {
        // Log is recent but count limit hasn't been hit yet
        this.logLimiter[logKey].count += 1
        return { isRateLimited: false }
      }
      else {
        // If log count is maxed for a given time interval
        return { isRateLimited: true }
      }
    }
    else {
      // If no logKey if found for the current log
      this.logLimiter[logKey] = { count: 1, firstTs: log.Timestamp }
      return { isRateLimited: false }
    }
  }

  private makeLogLimiterKey(log: MozLogMessage): string {
    return JSON.stringify({
      ...log,
      Timestamp: undefined,
    })
  }
}

export const defaultLogReporter = new DefaultLogReporter({
  name: "majc",
  defaultOptions: {
    envVersion: packageJson.version,
  },
})
