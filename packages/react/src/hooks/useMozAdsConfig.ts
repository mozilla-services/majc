import { createContext, useContext } from "react"
import { getConfig, MozAdsConfig } from "@core/config"

export const mozAdsConfigContext = createContext<Partial<MozAdsConfig>>(getConfig())

export const useMozAdsConfig = () => useContext(mozAdsConfigContext)
