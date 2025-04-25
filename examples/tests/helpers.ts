import { expect, Locator, Page } from '@playwright/test'
import { FixedSize } from '../../dist/core'

const expectAdLayout = async (page: Page, placementName: string, altText: string): Promise<void> => {
  const image = page.getByAltText(altText)
  await expect(image).toBeVisible()
  await expect(image).toHaveAttribute('src', new RegExp('^https://ads-img.allizom.org/'))

  const inner = page.locator('.moz-ads-placement-inner').filter({ has: image })
  await expect(inner).toHaveAttribute('aria-live', 'polite')
  await expect(inner).toHaveAttribute('aria-atomic', 'true')

  const container = page.locator('.moz-ads-placement-container').filter({ has: image })
  await expect(container).toHaveAttribute('data-placement-id', placementName)

  // Rounding the css widths and heights is needed here since some browsers (Mobile Safari) will
  // render the placement with a css dimension like '249.984375px' and that's close enough for us
  const { width, height } = await getBoundingRectangle(container)
  expect(Math.round(width)).toEqual(cssWidthForPlacement(placementName))
  expect(Math.round(height)).toEqual(cssHeightForPlacement(placementName))
}

const expectClickNavigation = async (page: Page, altText: string): Promise<void> => {
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

const cssWidthForPlacement = (placementName: string): number => {
  if (placementName.includes('billboard')) return FixedSize.Billboard.width
  if (placementName.includes('rectangle')) return FixedSize.MediumRectangle.width
  if (placementName.includes('skyscraper')) return FixedSize.Skyscraper.width
  if (placementName.includes('tile')) return 64
  return NaN
}

const cssHeightForPlacement = (placementName: string): number => {
  if (placementName.includes('billboard')) return FixedSize.Billboard.height
  if (placementName.includes('rectangle')) return FixedSize.MediumRectangle.height
  if (placementName.includes('skyscraper')) return FixedSize.Skyscraper.height
  if (placementName.includes('tile')) return 64
  return NaN
}

/**
 * Retrieve an element's bounding DOMRect
 *
 * @function getBoundingRectangle
 * @async
 * @param locator {Locator} The Playwright locator to evaluate (see: https://playwright.dev/docs/locators)
 * @returns Promise<DOMRect> The style value
 *
 * https://github.com/microsoft/playwright/issues/4282#issuecomment-718602677
 */
export const getBoundingRectangle = async (locator: Locator): Promise<DOMRect> => {
  return locator.evaluate(el => el.getBoundingClientRect())
}

export { expectAdLayout, expectClickNavigation }
