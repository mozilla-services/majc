import { expect, Page } from '@playwright/test'
import { FixedSize } from '../../dist/core'

const expectAdLayout = async (page: Page, placementName: string, altText: string) => {
  const image = page.getByAltText(altText)
  await expect(image).toBeVisible()
  await expect(image).toHaveAttribute('src', new RegExp('^https://ads-img.allizom.org/'))

  const inner = page.locator('.moz-ads-placement-inner').filter({ has: image })
  await expect(inner).toHaveAttribute('aria-live', 'polite')
  await expect(inner).toHaveAttribute('aria-atomic', 'true')

  const container = page.locator('.moz-ads-placement-container').filter({ has: image })
  await expect(container).toHaveCSS('width', cssWidthForPlacement(placementName))
  await expect(container).toHaveCSS('height', cssHeightForPlacement(placementName))
  await expect(container).toHaveAttribute('data-placement-id', placementName)
}

const expectClickNavigation = async (page: Page, altText: string) => {
  const link = page.getByRole('link', { name: altText })
  const href = await link.getAttribute('href') || ''
  const clickPromise = page.waitForRequest(href)
  await link.click()
  const landingPage = await clickPromise

  // When navigating to a url, Playwright adds a trailing slash between hostname and the query params.
  // This bit of code is needed to match an href from MARS (like "https://example.com?interaction=2")
  // with a location navigated by Playwright (like "https://example.com/?interaction=2")
  const normalizedHref = landingPage.url().replace('.com?', '.com/?')
  expect(landingPage.url()).toEqual(normalizedHref)
}

const cssWidthForPlacement = (placementName: string) => {
  if (placementName.indexOf('billboard') != -1) return `${FixedSize.Billboard.width}px`
  if (placementName.indexOf('rectangle') != -1) return `${FixedSize.MediumRectangle.width}px`
  if (placementName.indexOf('skyscraper') != -1) return `${FixedSize.Skyscraper.width}px`
  if (placementName.indexOf('tile') != -1) return '64px'
  return 'Ceci n\'est pas une css width'
}

const cssHeightForPlacement = (placementName: string) => {
  if (placementName.indexOf('billboard') != -1) return `${FixedSize.Billboard.height}px`
  if (placementName.indexOf('rectangle') != -1) return `${FixedSize.MediumRectangle.height}px`
  if (placementName.indexOf('skyscraper') != -1) return `${FixedSize.Skyscraper.height}px`
  if (placementName.indexOf('tile') != -1) return '64px'
  return 'Ceci n\'est pas une css height'
}

export { expectAdLayout, expectClickNavigation }
