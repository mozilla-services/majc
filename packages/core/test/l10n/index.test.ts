import { l, MozAdsLocalizedStringKey } from "../../src/l10n/index"

describe("core/l10n/index.ts", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test("l translates \"Report ad\" tooltip for en-US", () => {
    Object.defineProperty(globalThis, "navigator", {
      value: {
        language: "en-US",
      },
    })

    expect(l("report_ad_button_tooltip")).toEqual("Report ad")
  })

  test("l translates \"Report ad\" tooltip for unknown locale as en-US", () => {
    Object.defineProperty(globalThis, "navigator", {
      value: {
        language: "xx-XX",
      },
    })
    expect(l("report_ad_button_tooltip")).toEqual("Report ad")
  })

  test("l returns untranslated key for unknown strings", () => {
    expect(l("foobar" as MozAdsLocalizedStringKey)).toEqual("foobar")
  })
})
