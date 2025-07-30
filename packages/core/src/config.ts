export interface MozAdsConfig {
  gppEnabled: boolean
  gppReadyTimeout: number
}

const config: MozAdsConfig = {
  gppEnabled: false,
  gppReadyTimeout: 10_000,
}

export function getConfig(): MozAdsConfig {
  return { ...config }
}

export function setConfig(newConfig: Partial<MozAdsConfig>) {
  for (const key in newConfig) {
    const value = newConfig[key as keyof MozAdsConfig]
    if (value !== undefined) {
      setConfigValue(key as keyof MozAdsConfig, value)
    }
  }
}

export function getConfigValue<K extends keyof MozAdsConfig>(key: K): MozAdsConfig[K] {
  return config[key]
}

export function setConfigValue<K extends keyof MozAdsConfig>(key: K, value: MozAdsConfig[K]) {
  config[key] = value
}
