import { getConfigValue } from "./config"
import { getItemFromStore, setItemInStore, StoreType } from "./store"
import { GPPEvent, GPPEventNameType, GPPFunction, GPPPing } from "./types"

export class GPPError extends Error {
  override name = "GPPError"
  public cause: Error
  constructor(
    cause: Error,
  ) {
    super(cause.message, { cause })
    this.cause = cause
  }
}

let gppFunctionPromiseWithResolvers: PromiseWithResolvers<GPPFunction> | undefined
let checkGPPStartTime: number | undefined

function sleep(delay?: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, delay))
}

function getCachedPing(): GPPPing | null | undefined {
  try {
    return JSON.parse(getItemFromStore("gppPing", StoreType.Persistent) ?? "undefined")
  }
  catch {
    return undefined
  }
}

function setCachedPing(gppPing: GPPPing | null) {
  setItemInStore("gppPing", JSON.stringify(gppPing), StoreType.Persistent)
}

function getGPPFunction(): Promise<GPPFunction> {
  async function checkGPP() {
    if (globalThis.__gpp) {
      gppFunctionPromiseWithResolvers?.resolve(globalThis.__gpp)
    }
    else {
      if (checkGPPStartTime && Date.now() - checkGPPStartTime >= getConfigValue("gppReadyTimeout")) {
        // If we encounter the timeout, prevent subsequent page loads from waiting for GPP
        // by caching a `null` ping.
        if (getCachedPing() === undefined) {
          setCachedPing(null)
        }

        gppFunctionPromiseWithResolvers?.reject(new GPPError(new Error("Timeout exceeded waiting for GPPFunction")))
        gppFunctionPromiseWithResolvers = undefined
        checkGPPStartTime = undefined
      }
      else {
        await sleep(10)
        checkGPP()
      }
    }
  }

  if (!gppFunctionPromiseWithResolvers) {
    gppFunctionPromiseWithResolvers = Promise.withResolvers()
    checkGPPStartTime = Date.now()
    checkGPP()
  }

  return gppFunctionPromiseWithResolvers.promise
}

type GPPWrapperEventListener = (event: GPPEvent) => void

interface GPPWrapperEventListenerOptions {
  once?: boolean
}

export interface GPPWrapperInterface {
  addEventListener(eventName: GPPEventNameType, listener: GPPWrapperEventListener, options?: GPPWrapperEventListenerOptions): Promise<void>
  removeEventListener(eventName: GPPEventNameType, listener: GPPWrapperEventListener): Promise<void>
  ping(): Promise<GPPPing | null>
}

class GPPWrapper implements GPPWrapperInterface {
  private eventListeners: Partial<Record<GPPEventNameType, WeakMap<GPPWrapperEventListener, number[]>>> = {}
  private isMonitoringSectionChange = false

  private async startMonitoringSectionChange(): Promise<void> {
    if (!this.isMonitoringSectionChange) {
      this.isMonitoringSectionChange = true

      try {
        await this.addEventListener("sectionChange", event => setCachedPing(event.pingData))
      }
      catch {
        this.isMonitoringSectionChange = false
        await sleep(1_000)
        return this.startMonitoringSectionChange()
      }
    }
  }

  async addEventListener(eventName: GPPEventNameType, listener: GPPWrapperEventListener, options?: GPPWrapperEventListenerOptions) {
    const gppFunction = await getGPPFunction()

    const listenerRegisteredEvent = gppFunction("addEventListener", (event, success) => {
      if (!success || event.eventName !== eventName) {
        return
      }

      listener(event)

      if (options?.once) {
        this.removeEventListener(eventName, listener)
      }
    })

    const attachedListeners = this.eventListeners[eventName] ?? new WeakMap()
    this.eventListeners[eventName] = attachedListeners

    const listenerIds = attachedListeners.get(listener) ?? []
    listenerIds.push(listenerRegisteredEvent.listenerId)
    attachedListeners.set(listener, listenerIds)
  }

  async removeEventListener(eventName: GPPEventNameType, listener: GPPWrapperEventListener) {
    const gppFunction = await getGPPFunction()

    const attachedListeners = this.eventListeners[eventName]
    const listenerIds = attachedListeners?.get(listener) ?? []
    for (const listenerId of listenerIds) {
      gppFunction("removeEventListener", () => { }, listenerId)
    }

    attachedListeners?.delete(listener)
  }

  async ping(): Promise<GPPPing | null> {
    // Start monitoring in the background.
    setTimeout(() => this.startMonitoringSectionChange())

    const cachedPing = getCachedPing()
    if (cachedPing !== undefined) {
      return cachedPing
    }

    const gppFunction = await getGPPFunction()
    return new Promise((resolve) => {
      gppFunction("ping", (ping, success) => {
        if (success && ping.signalStatus === "ready") {
          resolve(ping)
        }
        else {
          this.addEventListener("signalStatus", (event) => {
            setCachedPing(event.pingData)
            resolve(event.pingData)
          }, { once: true })
        }
      })
    })
  }
}

export const gppWrapper = new GPPWrapper()
