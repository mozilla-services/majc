(function (window) {
  const bannerHtml = `
<div id="mock-banner" tabindex="0" role="region" aria-label="Cookie banner">
  <style>
    #mock-banner { background: rgba(255, 255, 255, 0.95); font-size: 16px; bottom: 0; left: 0; width: 100%; padding: 0.5em; box-sizing: border-box; position: fixed; z-index: 999999; }
    .mock-banner-policy { color: #000; line-height: 1; }
    .mock-banner-policy > h2 { font-size: 1em; font-weight: bold; margin: 0; }
    .mock-banner-button-group { text-align: right; }
    .mock-banner-button-group > button { background: #000; border: none; color: #fff; cursor: pointer; font-family: inherit; font-size: 1em; line-height: 1; padding: 0.25em 0.5em; }
  </style>
  <div role="dialog" aria-label="Your Choice Regarding Cookies">
    <div class="mock-banner-policy">
      <h2>Your Choice Regarding Cookies</h2>
      <div>
        We use necessary cookies to make sure our site works. We would
        also like to use analytics tools and functional cookies to
        enhance your experience and give us insights into how our site
        is used. Some of our ad partners also use personalized
        advertising cookies.
      </div>
      <div class="mock-banner-button-group">
        <button name="mock-banner-reject-button">Reject All</button>
        <button name="mock-banner-accept-button">Accept All</button>
      </div>
    </div>
  </div>
</div>
`

  let pingData = {
    gppVersion: "1.1",
    cmpStatus: "loaded",
    cmpDisplayStatus: "hidden",
    signalStatus: "ready",
    supportedAPIs: ["8:usca"],
    cmpId: 28,
    sectionList: [8],
    applicableSections: [8],
    gppString: "DBABBg~BUUAAACA.QA",
    parsedSections: {
      usca: {
        Version: 1,
        SaleOptOutNotice: 1,
        SharingOptOutNotice: 1,
        SensitiveDataLimitUseNotice: 0,
        SaleOptOut: 1,
        SharingOptOut: 1,
        SensitiveDataProcessing: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        KnownChildSensitiveDataConsents: [0, 0],
        PersonalDataConsents: 0,
        MspaCoveredTransaction: 2,
        MspaOptOutOptionMode: 0,
        MspaServiceProviderMode: 0,
        GpcSegmentType: 1,
        Gpc: false,
      },
    },
  }

  let lastListenerId = 0

  const gppCommands = {
    ping: function (callback) {
      window.setTimeout(() => {
        callback(getPingData())
      })
    },
    addEventListener: function (callback) {
      const listenerId = lastListenerId + 1
      lastListenerId = listenerId

      window.setTimeout(() => {
        callback({ eventName: "cmpStatus", listenerId: listenerId, data: "loaded", pingData: getPingData() }, true)

        window.setTimeout(() => {
          callback({ eventName: "signalStatus", listenerId: listenerId, data: "ready", pingData: getPingData() }, true)

          window.setTimeout(() => {
            callback({ eventName: "cmpDisplayStatus", listenerId: listenerId, data: "visible", pingData: getPingData() }, true)
          })
        })
      })
    },
    removeEventListener: function () {},
    hasSection: function () {},
    getSection: function () {},
    getField: function () {},
  }

  window.document.addEventListener("DOMContentLoaded", () => {
    if (!window.sessionStorage.getItem("mock-gpp-ping-data")) {
      const fragment = window.document.createRange().createContextualFragment(bannerHtml)
      window.document.body.appendChild(fragment)

      window.document.querySelector("#mock-banner button[name='mock-banner-reject-button']").addEventListener("click", onRejectButtonClick)
      window.document.querySelector("#mock-banner button[name='mock-banner-accept-button']").addEventListener("click", onAcceptButtonClick)
    }

    window.__gpp = function (command, callback, parameter, version) {
      gppCommands[command](callback, parameter, version)
    }
  })

  function getPingData() {
    return JSON.parse(window.sessionStorage.getItem("mock-gpp-ping-data")) || pingData
  }

  function onRejectButtonClick() {
    window.sessionStorage.setItem("mock-gpp-ping-data", JSON.stringify(pingData))
    window.document.getElementById("mock-banner").remove()
  }

  function onAcceptButtonClick() {
    pingData.gppString = "DBABBg~BUoAAACA.QA"
    pingData.parsedSections.usca.SaleOptOut = 2
    pingData.parsedSections.usca.SharingOptOut = 2
    window.sessionStorage.setItem("mock-gpp-ping-data", JSON.stringify(pingData))
    window.document.getElementById("mock-banner").remove()
  }
})(this)
