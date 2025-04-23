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
  })

  test.describe('Billboard', ({ tag: ['@Desktop', '@Mobile'] }), () => {
    test('should display the ad', async ({ page }) => {
      await expectAdLayout(page, 'mock_pocket_billboard_1', 'Brand Text 0')
    })

    test('should navigate to the landing page on click', async ({ page }) => {
      await expectClickNavigation(page, 'Brand Text 0')
    })
  })

  test.describe('Skyscraper', ({ tag: ['@Desktop', '@Mobile'] }), () => {
    test('should display the ad', async ({ page }) => {
      await expectAdLayout(page, 'mock_pocket_skyscraper_1', 'Brand Text 1')
    })

    test('should navigate to the landing page on click', async ({ page }) => {
      await expectClickNavigation(page, 'Brand Text 1')
    })
  })
})

//   test('should register an impression for each ad', async ({ page }) => {
//     let requestCount = 0
//     page.on('request', (request) => {
//       expect(request.url().startsWith('https://ads.allizom.org/v1/t?data=')).toBeTruthy()
//       expect(request.method()).toEqual('GET')
//       requestCount += 1
//     })
//     page.on('response', (response) => {
//       expect(response).toBeDefined()
//       expect(response?.ok()).toBeTruthy()
//     })
//     expect(requestCount).toBe(4)
//   })
// })

// test.describe('Context Id', { tag: ['@Desktop', '@Mobile'] }, () => { })

// Trying to assert that the click callback happened ...
// test('should register the click', async ({ page }) => {
//   const adSurfacePage = page
//   const impressionCallbackPromise = adSurfacePage.waitForRequest(new RegExp('^https://ads-img.allizom.org/'))
//   const impressionCallbackRequest = await impressionCallbackPromise
//   const impressionCallbackResponse = await impressionCallbackRequest.response()
//   expect(impressionCallbackResponse?.ok()).toBeTruthy()

//   const link = page.getByRole('link', { name: 'Mozilla Ad' })
//   console.log('before click', page.url())

//   const clickCallbackPromise = adSurfacePage.waitForRequest(new RegExp('^https://ads-img.allizom.org/'))
//   await link.click()
//   const clickCallbackRequest = await clickCallbackPromise
//   const clickCallbackResponse = await clickCallbackRequest.response()
//   expect(clickCallbackResponse?.ok()).toBeTruthy()
// })
