import { DefaultLogger } from "./logger"

const logger = new DefaultLogger({ name: "core.config" })

export interface Config {
  gppEnabled: boolean
  gppReadyTimeout: number
}

const config: Config = {
  gppEnabled: false,
  gppReadyTimeout: 10_000,
}

export function getConfig(): Config {
  return { ...config }
}

export function getConfigValue<K extends keyof Config>(key: K): Config[K] {
  return config[key]
}

export function setConfigValue<K extends keyof Config>(key: K, value: Config[K]) {
  config[key] = value

  logger.info(`Set Config key "${key}" to value: ${value}`)
}
