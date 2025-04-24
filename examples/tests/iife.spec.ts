import { test, expect } from '@playwright/test'
import { expectAdLayout, expectClickNavigation } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:8080/examples/iife/')
  await expect(page).toHaveTitle(/powered by MAJC/)
})

test.describe('IIFE example', () => {
  // Tiles won't be returned by MARS for mobile, so we only test them on Desktop
  test.describe('Tile', { tag: ['@Desktop'] }, () => {
    test('should display the ad', async ({ page }) => {
      await expectAdLayout(page, 'newtab_tile_1', 'Mozilla Ad')
    })

    test('should navigate to the landing page on click', async ({ page }) => {
      await expectClickNavigation(page, 'Mozilla Ad')
    })
  })

  test.describe('Medium Rectangle', ({ tag: ['@Desktop', '@Mobile'] }), () => {
    test('should display the ad', async ({ page }) => {
      await expectAdLayout(page, 'mock_pocket_rectangle_1', 'Brand Text 2')
    })

    test('should navigate to the landing page on click', async ({ page }) => {
      await expectClickNavigation(page, 'Brand Text 2')
    })

    test.skip('should be able to report the ad', async () => { })
  })

  test.describe('Billboard', ({ tag: ['@Desktop', '@Mobile'] }), () => {
    test('should display the ad', async ({ page }) => {
      await expectAdLayout(page, 'mock_pocket_billboard_1', 'Brand Text 0')
    })

    test('should navigate to the landing page on click', async ({ page }) => {
      await expectClickNavigation(page, 'Brand Text 0')
    })

    test.skip('should be able to report the ad', async () => { })
  })

  test.describe('Skyscraper', ({ tag: ['@Desktop', '@Mobile'] }), () => {
    test('should display the ad', async ({ page }) => {
      await expectAdLayout(page, 'mock_pocket_skyscraper_1', 'Brand Text 1')
    })

    test('should navigate to the landing page on click', async ({ page }) => {
      await expectClickNavigation(page, 'Brand Text 1')
    })

    test.skip('should be able to report the ad', async () => { })
  })

  // This is a tricky one to get right. I think playwright isn't waiting
  // long enough to get impressions on these. Might need to scroll differently,
  // do some additional/different actions to keep the placement in view, or add some waiting...
  test.describe('Impression callback', ({ tag: ['@Desktop', '@Mobile'] }), () => {
    test.skip('should be sent for each ad', async ({ page }) => {
      let requestCount = 0
      page.on('request', (request) => {
        console.log(`request made: ${request.url()}`)
        if (request.url().startsWith('https://ads.allizom.org/v1/t?data=')) requestCount += 1
      })

      const tile = page.getByAltText('Mozilla Ad')
      await tile.scrollIntoViewIfNeeded()
      await tile.hover()

      const rectangle = page.getByAltText('Brand Text 2')
      await rectangle.scrollIntoViewIfNeeded()
      await rectangle.hover()

      const billboard = page.getByAltText('Brand Text 0')
      await billboard.scrollIntoViewIfNeeded()
      await billboard.hover()

      const skyscraper = page.getByAltText('Brand Text 1')
      await skyscraper.scrollIntoViewIfNeeded()
      await skyscraper.hover()

      expect(requestCount).toBe(4)
    })
  })

  test.describe('Click callback', ({ tag: ['@Desktop', '@Mobile'] }), () => {
    test.skip('should be sent for each ad', async () => { })
  })

  test.describe('Context Id', ({ tag: ['@Desktop', '@Mobile'] }), () => {
    test.skip('should rotate on each page load', async () => { })
  })
})
