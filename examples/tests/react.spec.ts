import { test, expect } from "@playwright/test"
import { altTextPrefixes, expectAdLayout, expectClickNavigation } from "./helpers"

test.beforeEach(async ({ page }) => {
  await page.goto("http://127.0.0.1:3000/")
  await expect(page).toHaveTitle(/Example Article with Ads/)
})

test.describe("React example", () => {
  test.describe("Billboard", ({ tag: ["@Desktop"] }), () => {
    test.describe("above the fold", () => {
      test("should display the ad", async ({ page }) => {
        await expectAdLayout(page, "pocket_billboard_1", altTextPrefixes["billboard_1"])
      })

      test("should navigate to the landing page on click", async ({ page }) => {
        await expectClickNavigation(page, altTextPrefixes["billboard_1"])
      })

      test.skip("should be able to report the ad", async () => { })
      test.skip("should display the fallback ad when a live ad isn't available", async () => { })
    })

    test.describe("below the fold", () => {
      test("should display the ad", async ({ page }) => {
        await expectAdLayout(page, "pocket_billboard_2", altTextPrefixes["billboard_2"])
      })

      test("should navigate to the landing page on click", async ({ page }) => {
        await expectClickNavigation(page, altTextPrefixes["billboard_2"])
      })

      test.skip("should be able to report the ad", async () => { })
      test.skip("should display the fallback ad when a live ad isn't available", async () => { })
    })
  })

  // This can be enabled once we update the React example Article to be responsive and show
  // rectangles instead of billboards for mobile
  test.describe("Medium Rectangle", ({ tag: ["@Mobile"] }), () => {
    test.skip("should display the ad", async ({ page }) => {
      await expectAdLayout(page, "pocket_rectangle_1", altTextPrefixes["rectangle_1"])
    })

    test.skip("should navigate to the landing page on click", async ({ page }) => {
      await expectClickNavigation(page, altTextPrefixes["rectangle_1"])
    })

    test.skip("should be able to report the ad", async () => { })
    test.skip("should display the fallback ad when a live ad isn't available", async () => { })
  })

  // It should be possible to test this on Mobile as well, but there is a tricky issue
  // with clicking on the Skyscraper on Mobile Chrome that needs to be figured out.
  test.describe("Skyscraper", ({ tag: ["@Desktop"/* , @Mobile  */] }), () => {
    test("should display the ad", async ({ page }) => {
      await expectAdLayout(page, "pocket_skyscraper_1", altTextPrefixes["skyscraper_1"])
    })

    test("should navigate to the landing page on click", async ({ page }) => {
      await expectClickNavigation(page, altTextPrefixes["skyscraper_1"])
    })

    test.skip("should be able to report the ad", async () => { })
    test.skip("should display the fallback ad when a live ad isn't available", async () => { })
  })

  test.describe("Impression callback", ({ tag: ["@Desktop", "@Mobile"] }), () => {
    test.skip("should be sent for each ad", async () => { })
  })

  test.describe("Click callback", ({ tag: ["@Desktop", "@Mobile"] }), () => {
    test.skip("should be sent for each ad", async () => { })
  })

  test.describe("Context Id", ({ tag: ["@Desktop", "@Mobile"] }), () => {
    test.skip("should rotate on each page load", async () => { })
  })
})
