import { expect, Page } from '@playwright/test'

const expectAdLayout = async (page: Page, placementName: string, altText: string, cssWidth: string, cssHeight: string) => {
  const image = page.getByAltText(altText)
  await expect(image).toBeVisible()
  await expect(image).toHaveAttribute('src', new RegExp('^https://ads-img.allizom.org/'))

  const inner = page.locator('.moz-ads-placement-inner').filter({ has: image })
  await expect(inner).toHaveAttribute('aria-live', 'polite')
  await expect(inner).toHaveAttribute('aria-atomic', 'true')

  const container = page.locator('.moz-ads-placement-container').filter({ has: image })
  await expect(container).toHaveCSS('width', cssWidth)
  await expect(container).toHaveCSS('height', cssHeight)
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

export { expectAdLayout, expectClickNavigation }
