import React from "react"
import { getConfig, MozAdsConfig } from "@core/config"
import { mozAdsConfigContext } from "../hooks/useMozAdsConfig"

export interface MozAdsConfigProviderProps {
  children?: React.ReactNode
  config?: Partial<MozAdsConfig>
}

export const MozAdsConfigProvider = ({
  children,
  config = getConfig(),
}: MozAdsConfigProviderProps) => {
  return (
    <mozAdsConfigContext.Provider value={config}>
      {children}
    </mozAdsConfigContext.Provider>
  )
}
