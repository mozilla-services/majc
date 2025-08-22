import { test, expect } from "@playwright/test"
import { altTextPrefixes, expectAdLayout, expectClickNavigation } from "./helpers"

test.beforeEach(async ({ page }) => {
  await page.goto("http://127.0.0.1:8080/examples/iife/")
  await expect(page).toHaveTitle(/powered by MAJC/)
})

test.describe("IIFE example", () => {
  // Tiles won't be returned by MARS for mobile, so we only test them on Desktop
  test.describe("Tile", { tag: ["@Desktop"] }, () => {
    test("should display the ad", async ({ page }) => {
      await expectAdLayout(page, "newtab_tile_1", altTextPrefixes["tile"])
    })

    test("should navigate to the landing page on click", async ({ page }) => {
      await expectClickNavigation(page, altTextPrefixes["tile"])
    })

    test.skip("should display the fallback ad when a live ad isn't available", async () => { })
  })

  // It should be possible to test this on Mobile as well, but there is a tricky issue
  // with clicking on the Rectangle on Mobile Chrome that needs to be figured out.
  test.describe("Medium Rectangle", ({ tag: ["@Desktop"/*  '@Mobile' */] }), () => {
    test("should display the ad", async ({ page }) => {
      await expectAdLayout(page, "pocket_rectangle_1", altTextPrefixes["rectangle_1"])
    })

    test("should navigate to the landing page on click", async ({ page }) => {
      await expectClickNavigation(page, altTextPrefixes["rectangle_1"])
    })

    test.skip("should be able to report the ad", async () => { })
    test.skip("should display the fallback ad when a live ad isn't available", async () => { })
  })

  test.describe("Billboard", ({ tag: ["@Desktop", "@Mobile"] }), () => {
    test("should display the ad", async ({ page }) => {
      await expectAdLayout(page, "pocket_billboard_1", altTextPrefixes["billboard_1"])
    })

    test("should navigate to the landing page on click", async ({ page }) => {
      await expectClickNavigation(page, altTextPrefixes["billboard_1"])
    })

    test.skip("should be able to report the ad", async () => { })
    test.skip("should display the fallback ad when a live ad isn't available", async () => { })
  })

  // It should be possible to test this on Mobile as well, but there is a tricky issue
  // with clicking on the Skyscraper on Mobile Chrome that needs to be figured out.
  test.describe("Skyscraper", ({ tag: ["@Desktop"/*  '@Mobile' */] }), () => {
    test("should display the ad", async ({ page }) => {
      await expectAdLayout(page, "pocket_skyscraper_1", altTextPrefixes["skyscraper_1"])
    })

    test("should navigate to the landing page on click", async ({ page }) => {
      await expectClickNavigation(page, altTextPrefixes["skyscraper_1"])
    })

    test.skip("should be able to report the ad", async () => { })
    test.skip("should display the fallback ad when a live ad isn't available", async () => { })
  })

  // This is a tricky one to get right. I think playwright isn't waiting
  // long enough to get impressions on these. Might need to scroll differently,
  // do some additional/different actions to keep the placement in view, or add some waiting...
  test.describe("Impression callback", ({ tag: ["@Desktop", "@Mobile"] }), () => {
    test.skip("should be sent for each ad", async ({ page }) => {
      let requestCount = 0
      page.on("request", (request) => {
        console.log(`request made: ${request.url()}`)
        if (request.url().startsWith("https://ads.mozilla.org/v1/t?data=")) requestCount += 1
      })

      const tile = page.getByAltText(altTextPrefixes["tile"])
      await tile.scrollIntoViewIfNeeded()
      await tile.hover()

      const rectangle = page.getByAltText(altTextPrefixes["rectangle_1"])
      await rectangle.scrollIntoViewIfNeeded()
      await rectangle.hover()

      const billboard = page.getByAltText(altTextPrefixes["billboard_1"])
      await billboard.scrollIntoViewIfNeeded()
      await billboard.hover()

      const skyscraper = page.getByAltText(altTextPrefixes["skyscraper_1"])
      await skyscraper.scrollIntoViewIfNeeded()
      await skyscraper.hover()

      expect(requestCount).toBe(4)
    })
  })

  test.describe("Click callback", ({ tag: ["@Desktop", "@Mobile"] }), () => {
    test.skip("should be sent for each ad", async () => { })
  })

  test.describe("Context Id", ({ tag: ["@Desktop", "@Mobile"] }), () => {
    test.skip("should rotate on each page load", async () => { })
  })
})
