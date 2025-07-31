import { getConfigValue } from "./config"
import { GPPFunction, GPPPing } from "./types"

let gppPromiseWithResolvers: PromiseWithResolvers<GPPFunction> | undefined
let checkGPPStartTime: number | undefined

export async function getGPP(): Promise<GPPFunction> {
  function checkGPP() {
    if (window.__gpp) {
      gppPromiseWithResolvers?.resolve(window.__gpp)
    }
    else {
      if (checkGPPStartTime && Date.now() - checkGPPStartTime >= getConfigValue("gppReadyTimeout")) {
        gppPromiseWithResolvers?.reject(new Error("Timeout exceeded waiting for window.__gpp global function"))
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
      if (success) {
        resolve(data.pingData)
      }
      else {
        reject(data)
      }
    })
  })
}
