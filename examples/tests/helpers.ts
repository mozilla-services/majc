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
  const containerCSSWidth = await getStyle(container, 'width')
  const containerCSSHeight = await getStyle(container, 'height')
  expect(`${round(containerCSSWidth)}px`).toEqual(cssWidthForPlacement(placementName))
  expect(`${round(containerCSSHeight)}px`).toEqual(cssHeightForPlacement(placementName))
}

const expectClickNavigation = async (page: Page, altText: string): Promise<void> => {
  const link = page.getByRole('link', { name: altText })
  const href = await link.getAttribute('href') || ''
  const clickPromise = page.waitForRequest(href)

  // Forcing the click here seems to be necessary for Mobile Chrome, where playwright thinks
  // that the something about img inside the link "intercepts pointer events". I could not repro
  // this issue in manual testing, but it may be worth revisiting either playwright usage or our DOM
  // structure to see if there is a way to go without forcing here.
  await link.click({ force: true })
  const landingPage = await clickPromise

  // When navigating to a url, Playwright adds a trailing slash between hostname and the query params.
  // This bit of code is needed to match an href from MARS (like "https://example.com?interaction=2")
  // with a location navigated by Playwright (like "https://example.com/?interaction=2")
  const normalizedHref = landingPage.url().replace('.com?', '.com/?')
  expect(landingPage.url()).toEqual(normalizedHref)
}

const cssWidthForPlacement = (placementName: string): string => {
  if (placementName.indexOf('billboard') != -1) return `${FixedSize.Billboard.width}px`
  if (placementName.indexOf('rectangle') != -1) return `${FixedSize.MediumRectangle.width}px`
  if (placementName.indexOf('skyscraper') != -1) return `${FixedSize.Skyscraper.width}px`
  if (placementName.indexOf('tile') != -1) return '64px'
  return 'Ceci n\'est pas un css width'
}

const cssHeightForPlacement = (placementName: string): string => {
  if (placementName.indexOf('billboard') != -1) return `${FixedSize.Billboard.height}px`
  if (placementName.indexOf('rectangle') != -1) return `${FixedSize.MediumRectangle.height}px`
  if (placementName.indexOf('skyscraper') != -1) return `${FixedSize.Skyscraper.height}px`
  if (placementName.indexOf('tile') != -1) return '64px'
  return 'Ceci n\'est pas un css height'
}

const round = (cssDimension: string): number => {
  if (!cssDimension.endsWith('px')) return -1
  return Math.round(parseFloat(cssDimension.slice(0, -2)))
}

/**
 * Retrieve a computed style for an element.
 *
 * @function getStyle
 * @async
 * @param locator {Locator} The Playwright locator to evaluate (see: https://playwright.dev/docs/locators)
 * @param property {string} The CSS property for the style to retrieve
 * @returns Promise<string> The style value
 *
 * https://github.com/microsoft/playwright/issues/4282#issuecomment-718602677
 */
export const getStyle = async (locator: Locator, property: string): Promise<string> => {
  return locator.evaluate((el, property) => window.getComputedStyle(el)
    .getPropertyValue(property), property)
}

export { expectAdLayout, expectClickNavigation }
