import { getConfigValue } from "./config"
import { GPPFunction, GPPPing } from "./types"

let gppPromiseWithResolvers: PromiseWithResolvers<GPPFunction> | undefined
let checkGPPStartTime: number | undefined

export class GetGPPError extends Error {
  override name = "GetGPPError"
  constructor(
    public cause: Error,
  ) {
    super(cause.message, { cause })
  }
}

export async function getGPP(): Promise<GPPFunction> {
  function checkGPP() {
    if (globalThis.__gpp) {
      gppPromiseWithResolvers?.resolve(globalThis.__gpp)
    }
    else {
      if (checkGPPStartTime && Date.now() - checkGPPStartTime >= getConfigValue("gppReadyTimeout")) {
        gppPromiseWithResolvers?.reject(new GetGPPError(new Error("Timeout exceeded waiting for GPPFunction")))
        gppPromiseWithResolvers = undefined
        checkGPPStartTime = undefined
      }
      else {
        setTimeout(checkGPP, 10)
      }
    }
  }

  if (!gppPromiseWithResolvers) {
    gppPromiseWithResolvers = Promise.withResolvers()
    checkGPPStartTime = Date.now()
    checkGPP()
  }

  return gppPromiseWithResolvers.promise
}

export async function getGPPPing(): Promise<GPPPing> {
  const gpp = await getGPP()

  return new Promise((resolve, reject) => {
    gpp("addEventListener", (data, success) => {
      if (!success) {
        reject(data)
      }

      if (data.eventName !== "signalStatus") {
        return
      }

      resolve(data.pingData)

      gpp("removeEventListener", () => {}, data.listenerId)
    })
  })
}
