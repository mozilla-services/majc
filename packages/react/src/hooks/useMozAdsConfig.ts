import React from "react"
import { getConfig, MozAdsConfig } from "@core/config"

export const MozAdsConfigContext = React.createContext<Partial<MozAdsConfig>>(getConfig())

export const useMozAdsConfig = () => React.useContext(MozAdsConfigContext)
