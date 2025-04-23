import { test, expect } from '@playwright/test'
import { expectAdLayout, expectClickNavigation } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/')
  await expect(page).toHaveTitle(/Example Article with Ads/)
})

test.describe('React example', () => {
  test.describe('Billboard', ({ tag: ['@Desktop', '@Mobile'] }), () => {
    test.describe('above the fold', () => {
      test('should display the ad', async ({ page }) => {
        await expectAdLayout(page, 'mock_pocket_billboard_1', 'Brand Text 0')
      })

      test('should navigate to the landing page on click', async ({ page }) => {
        await expectClickNavigation(page, 'Brand Text 0')
      })
    })

    test.describe('below the fold', () => {
      test('should display the ad', async ({ page }) => {
        await expectAdLayout(page, 'mock_pocket_billboard_2', 'Brand Text 2')
      })

      test('should navigate to the landing page on click', async ({ page }) => {
        await expectClickNavigation(page, 'Brand Text 2')
      })
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
