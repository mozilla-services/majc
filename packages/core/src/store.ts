import { v4 as uuidv4 } from "uuid"
import { DefaultLogger } from "./logger"

const MOZ_ADS_STORE_PREFIX = "__mozads__"

export type MozAdsStoreKey = "contextId"

export enum StoreType {
  Persistent,
  SessionOnly,
}

const logger = new DefaultLogger({ name: "core.store" })

export const getItemFromStore = (key: MozAdsStoreKey, storeType: StoreType = StoreType.SessionOnly): string | null => {
  return getStorage(storeType).getItem(`${MOZ_ADS_STORE_PREFIX}${key}`)
}

export const setItemInStore = (key: MozAdsStoreKey, value: string, storeType: StoreType = StoreType.SessionOnly) => {
  getStorage(storeType).setItem(`${MOZ_ADS_STORE_PREFIX}${key}`, value)
}

export const removeItemFromStore = (key: MozAdsStoreKey, storeType: StoreType = StoreType.SessionOnly) => {
  getStorage(storeType).removeItem(`${MOZ_ADS_STORE_PREFIX}${key}`)
}

export const getOrGenerateContextId = (forceRegenerate: boolean = false): string => {
  let contextId = !forceRegenerate ? getItemFromStore("contextId") : null
  if (contextId) {
    return contextId
  }

  contextId = uuidv4()

  setItemInStore("contextId", contextId)
  logger.debug(`Updated contextId in session store: ${contextId}`)

  return contextId
}

function getStorage(storeType: StoreType): Storage {
  return storeType === StoreType.Persistent ? window.localStorage : window.sessionStorage
}
