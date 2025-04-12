import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:8080/examples/iife/')
  await expect(page).toHaveTitle(/powered by MAJC/)
})

test.describe('Tiles', { tag: '@Desktop' }, () => {
  test('should show the ad image', async ({ page }) => {
    const tileImage = page.getByAltText('Mozilla Ad')
    await expect(tileImage).toBeVisible()
    await expect(tileImage).toHaveAttribute('src', new RegExp('^https://ads-img.allizom.org/'))

    const tileInner = page.locator('.moz-ads-placement-inner').filter({ has: tileImage })
    await expect(tileInner).toHaveAttribute('aria-live', 'polite')
    await expect(tileInner).toHaveAttribute('aria-atomic', 'true')

    const tileContainer = page.locator('.moz-ads-placement-container').filter({ has: tileImage })
    await expect(tileContainer).toHaveCSS('width', '64px')
    await expect(tileContainer).toHaveCSS('height', '64px')
    await expect(tileContainer).toHaveAttribute('data-placement-id', 'newtab_tile_1')
  })

  // test('should register an impression', async ({ page }) => { })

  test('should register a click and navigate to the landing page', async ({ page }) => {
  })

  test('should allow me to report an ad', async ({ page }) => {
  })
})

test.describe('Billboard', { tag: '@Desktop' }, () => {
  // test('should show the ad image', async ({ page }) => { })
  // test('should register an impression', async ({ page }) => { })
  // test('should register a click and navigate to the landing page', async ({ page }) => { })
  // test('should allow me to report an ad', async ({ page }) => { })
})

test.describe('Skyscraper', { tag: ['@Desktop', '@Mobile'] }, () => { })

test.describe('Medium Rectangle', { tag: ['@Desktop', '@Mobile'] }, () => { })

// test('should show the ad image for a billboard', async ({ page }) => {
//   const
// })

// test('should show the ad image for a skyscraper', async ({ page }) => {
//   await expect(page.getByRole('img'))
// })

// test.describe('Click an Ad', () => {

//   test('should link to the landing page for a billboard', async ({ page }) => { })

//   test('should link to the landing page for a skyscraper', async ({ page }) => { })
// })

// test.describe('Report an Ad', () => {
//   test('should submit a report reason for a tile', async ({ page }) => { })
//   test('should submit a report reason for a billboard', async ({ page }) => { })
//   test('should submit a report reason for a skyscraper', async ({ page }) => { })
// })
