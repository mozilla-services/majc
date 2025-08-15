import React from "react"
import { getConfig, MozAdsConfig } from "@core/config"
import { MozAdsConfigContext } from "../hooks/useMozAdsConfig"

export interface MozAdsConfigProviderProps {
  children?: React.ReactNode
  config?: Partial<MozAdsConfig>
}

export const MozAdsConfigProvider = ({
  children,
  config = getConfig(),
}: MozAdsConfigProviderProps) => {
  return (
    <MozAdsConfigContext.Provider value={config}>
      {children}
    </MozAdsConfigContext.Provider>
  )
}
