import { test, expect } from "@playwright/test"
import { altTexts, expectAdLayout, expectClickNavigation } from "./helpers"

test.beforeEach(async ({ page }) => {
  await page.goto("http://127.0.0.1:8080/examples/iife/")
  await expect(page).toHaveTitle(/powered by MAJC/)
})

test.describe("IIFE example", () => {
  // Tiles won't be returned by MARS for mobile, so we only test them on Desktop
  test.describe("Tile", { tag: ["@Desktop"] }, () => {
    test("should display the ad", async ({ page }) => {
      await expectAdLayout(page, "newtab_tile_1", altTexts["tile"])
    })

    test("should navigate to the landing page on click", async ({ page }) => {
      await expectClickNavigation(page, altTexts["tile"])
    })

    test.skip("should display the fallback ad when a live ad isn't available", async () => { })
  })

  // It should be possible to test this on Mobile as well, but there is a tricky issue
  // with clicking on the Rectangle on Mobile Chrome that needs to be figured out.
  test.describe("Medium Rectangle", ({ tag: ["@Desktop"/*  '@Mobile' */] }), () => {
    test("should display the ad", async ({ page }) => {
      await expectAdLayout(page, "mock_pocket_rectangle_1", altTexts["rectangle_1"])
    })

    test("should navigate to the landing page on click", async ({ page }) => {
      await expectClickNavigation(page, altTexts["rectangle_1"])
    })

    test.skip("should be able to report the ad", async () => { })
    test.skip("should display the fallback ad when a live ad isn't available", async () => { })
  })

  test.describe("Billboard", ({ tag: ["@Desktop", "@Mobile"] }), () => {
    test("should display the ad", async ({ page }) => {
      await expectAdLayout(page, "mock_pocket_billboard_1", altTexts["billboard_1"])
    })

    test("should navigate to the landing page on click", async ({ page }) => {
      await expectClickNavigation(page, altTexts["billboard_1"])
    })

    test.skip("should be able to report the ad", async () => { })
    test.skip("should display the fallback ad when a live ad isn't available", async () => { })
  })

  // It should be possible to test this on Mobile as well, but there is a tricky issue
  // with clicking on the Skyscraper on Mobile Chrome that needs to be figured out.
  test.describe("Skyscraper", ({ tag: ["@Desktop"/*  '@Mobile' */] }), () => {
    test("should display the ad", async ({ page }) => {
      await expectAdLayout(page, "mock_pocket_skyscraper_1", altTexts["skyscraper_1"])
    })

    test("should navigate to the landing page on click", async ({ page }) => {
      await expectClickNavigation(page, altTexts["skyscraper_1"])
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
        if (request.url().startsWith("https://ads.allizom.org/v1/t?data=")) requestCount += 1
      })

      const tile = page.getByAltText(altTexts["tile"])
      await tile.scrollIntoViewIfNeeded()
      await tile.hover()

      const rectangle = page.getByAltText(altTexts["rectangle_1"])
      await rectangle.scrollIntoViewIfNeeded()
      await rectangle.hover()

      const billboard = page.getByAltText(altTexts["billboard_1"])
      await billboard.scrollIntoViewIfNeeded()
      await billboard.hover()

      const skyscraper = page.getByAltText(altTexts["skyscraper_1"])
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
