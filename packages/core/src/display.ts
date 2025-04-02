import { ImageAd } from '@heyapi'
import { INTER_FONT_BASE64 } from './fonts'
import { CLOSE_ICON_SVG, REPORT_ICON_SVG } from './icons'
import { l } from './l10n'
import { DefaultLogger } from './logger'
import {
  MozAdsPlacementWithContent,
  MozAdsRenderPlacementErrorEvent,
  MozAdsRenderPlacementEvent,
  MozAdsRenderPlacementReportEvent,
} from './types'

const logger = new DefaultLogger({ name: 'core.display' })

// Some styles derived from [Mozilla Protocol](https://github.com/mozilla/protocol) design system where noted
const styleHtml = `
  <style>
    @font-face { 
      font-display: swap;
      font-family: Inter;
      font-style: normal;
      font-weight: normal;
      src: url(data:application/octet-stream;base64,${INTER_FONT_BASE64}) format('woff2');
    }
    .moz-ads-placement-inner {
      all: initial;
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
    }
    .moz-ads-placement-spinner {
      --radius: 10px;
      border-radius: 50%;
      color: #ccc;
      margin-top: calc(0-var(--radius));
      margin-left: calc(0-var(--radius));
      position: relative;
      top: 50%;
      left: 50%;
      width: 2px;
      height: 2px;
      box-shadow:
        calc(1*var(--radius))    calc(0*var(--radius))    0 0,
        calc(0.7*var(--radius))  calc(0.7*var(--radius))  0 0.3333px,
        calc(0*var(--radius))    calc(1*var(--radius))    0 0.6667px,
        calc(-0.7*var(--radius)) calc(0.7*var(--radius))  0 1px,
        calc(-1*var(--radius))   calc(0*var(--radius))    0 1.3333px,
        calc(-0.7*var(--radius)) calc(-0.7*var(--radius)) 0 1.6667px,
        calc(0*var(--radius))    calc(-1*var(--radius))   0 2px;
      animation: moz-ads-placement-spinner-keyframes 1s infinite steps(8);
    }
    @keyframes moz-ads-placement-spinner-keyframes {
      100% {
        transform: rotate(1turn);
      }
    }
    .moz-ads-placement-link {
      all: initial;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      width: 100%;
      height: 100%;
    }
    .moz-ads-placement-img {
      all: initial;
      cursor: pointer;
      max-width: 100%;
      max-height: 100%;
    }
    .moz-ads-placement-button {
      all: initial;

      /* Mozilla Protocol */
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      cursor: pointer;
      display: inline-block;
      font-weight: 700;
      text-align: center;
      text-decoration: none !important;
      -webkit-transition: background-color .1s,box-shadow .1s,color .1s;
      transition: background-color .1s,box-shadow .1s,color .1s;
      appearance: button;
      border: 2px solid #000;
      font-family: Inter,X-LocaleSpecific,sans-serif;
      line-height: 1.5;
      background-color: #fff;
      border-color: #fff;
      color: #000;
      border-radius: 2px;
      font-size: .75rem;
      padding: 1px 16px;
    }
    .moz-ads-placement-button:focus,
    .moz-ads-placement-button:hover {
      /* Mozilla Protocol */
      background-color: #2b2a33;
      border-color: #fff;
      box-shadow: none;
      color: #fff;
    }
    .moz-ads-placement-button:disabled {
      /* Mozilla Protocol */
      opacity: .6;
      pointer-events: none;
    }
    .moz-ads-placement-button[hidden] {
      display: none;
    }
    .moz-ads-placement-report-button {
      font-size: 0;
      padding: 1px;
      position: absolute;
      right: 2px;
      bottom: 2px;
    }
    .moz-ads-placement-report-button > svg {
      fill: #000;
      width: 16px;
      height: 16px;
    }
    .moz-ads-placement-report-button:focus > svg,
    .moz-ads-placement-report-button:hover > svg {
      fill: #fff;
    }
    .moz-ads-placement-report-form {
      all: initial;
      background: rgba(0, 0, 0, 0.7);
      border: 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 0;
      padding: 0;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .moz-ads-placement-report-close-button,
    .moz-ads-placement-report-close-button:focus,
    .moz-ads-placement-report-close-button:hover {
      background-color: transparent;
      border-color: transparent;
      padding: 1px;
      position: absolute;
      top: 2px;
      left: 2px;
    }
    .moz-ads-placement-report-close-button > svg {
      stroke: #fff;
      width: 24px;
      height: 24px;
    }
    .moz-ads-placement-report-close-button:focus > svg,
    .moz-ads-placement-report-close-button:hover > svg {
      stroke: #0250bb;
    }
    .moz-ads-placement-report-title {
      all: initial;
      color: #fff;
      font-family: Inter,X-LocaleSpecific,sans-serif;
      font-size: 14px;
      line-height: 1.5;
      margin: 0 0 6px;
      padding: 0;
      text-align: center;
    }
    .moz-ads-placement-report-reason-select {
      all: initial;
      background-size: .75em auto,100%;
      border-radius: 2px;
      font-size: .75rem;
      min-width: 150px;
      overflow: hidden;
      margin: 0 0 8px;
      padding: 2px calc(.75em + 4px) 2px 2px;
      -webkit-user-select: none;
      user-select: none;

      /* Mozilla Protocol */
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      background-color: #fff;
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath fill='none' fill-rule='evenodd' stroke='%239595a2' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m5 9 7 7 7-7'/%3E%3C/svg%3E"),linear-gradient(180deg,#fff 0,#fff);
      background-position: right 8px top 50%;
      background-repeat: no-repeat,repeat;
      border: 2px solid #9595a2;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      display: block;
      font-weight: 400;
      max-width: 100%;
      text-overflow: ellipsis;
      font-family: Inter,X-LocaleSpecific,sans-serif;
      line-height: 1.5;
    }
    .moz-ads-placement-report-reason-select:focus,
    .moz-ads-placement-report-reason-select:hover {
      /* Mozilla Protocol */
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath fill='none' fill-rule='evenodd' stroke='%230250bb' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m5 9 7 7 7-7'/%3E%3C/svg%3E"),linear-gradient(180deg,#fff 0,#fff);
      border-color: #0250bb;
    }
    .moz-ads-placement-report-reason-select:disabled,
    .moz-ads-placement-report-reason-select[aria-disabled="true"] {
      /* Mozilla Protocol */
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath fill='none' fill-rule='evenodd' stroke='%239595a2' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m5 9 7 7 7-7'/%3E%3C/svg%3E"),linear-gradient(180deg,#f9f9fa 0,#f9f9fa);
      color: #5e5e72;
      border-color: #cdcdd4;
    }
  </style>
`

const spinnerHtml = `
  ${styleHtml}
  <div class="moz-ads-placement-container">
    <div class="moz-ads-placement-inner" aria-live="polite" aria-atomic="true">
      <div class="moz-ads-placement-spinner" title="${l('loading_spinner_tooltip')}"></div>
    </div>
  </div>
`

const adHtml = `
  ${styleHtml}
  <div class="moz-ads-placement-container">
    <div class="moz-ads-placement-inner" aria-live="polite" aria-atomic="true">
      <a class="moz-ads-placement-link">
        <img class="moz-ads-placement-img">
        <button type="button" class="moz-ads-placement-button moz-ads-placement-report-button" title="${l('report_ad_button_tooltip')}">
          ${REPORT_ICON_SVG}
        </button>
      </a>
    </div>
  </div>
`

const reportFormHtml = `
  <form class="moz-ads-placement-report-form">
    <button type="button" class="moz-ads-placement-button moz-ads-placement-report-close-button" title="${l('report_form_close_button_tooltip')}">
      ${CLOSE_ICON_SVG}
    </button>
    <p class="moz-ads-placement-report-title">${l('report_form_title_default')}</p>
    <select class="moz-ads-placement-report-reason-select" aria-label="${l('report_form_title_default')}">
      <option selected disabled>--${l('report_form_select_reason_option_none')}--</option>
      <option value="inappropriate">${l('report_form_select_reason_option_inappropriate')}</option>
      <option value="seen_multiple_times">${l('report_form_select_reason_option_seen_multiple_times')}</option>
      <option value="not_interested">${l('report_form_select_reason_option_not_interested')}</option>
    </select>
    <button type="submit" class="moz-ads-placement-button moz-ads-placement-report-submit-button" disabled>${l('report_form_submit_button')}</button>
  </form>
`

export interface MozAdsRenderPlacementProps {
  placement: MozAdsPlacementWithContent

  onClick?: (event: MozAdsRenderPlacementEvent) => void
  onReport?: (event: MozAdsRenderPlacementReportEvent) => void
  onError?: (event: MozAdsRenderPlacementErrorEvent) => void
  onLoad?: (event: MozAdsRenderPlacementEvent) => void
}

export function preloadImage(imageUrl: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (_event, _source, _lineno, _colno, error) => reject(error)

    img.src = imageUrl
  })
}

export function renderPlacement(element: HTMLElement, { placement, onClick, onError, onLoad, onReport }: MozAdsRenderPlacementProps) {
  renderSpinner()
  renderAd()

  function renderSpinner() {
    element.innerHTML = spinnerHtml
    updateContainerSize()
  }

  async function renderAd() {
    const imageUrl = placement.content?.image_url
    if (!imageUrl) {
      return
    }

    try {
      await preloadImage(imageUrl)

      element.innerHTML = adHtml
      updateContainerSize()
      attachEventListeners()
    }

    catch (error: unknown) {
      onError?.({
        placement,
        error: error as Error,
      })
    }

    const link = element.querySelector<HTMLAnchorElement>('.moz-ads-placement-link')
    if (link) {
      link.onclick = () => onClick?.({ placement })

      link.dataset.placementId = placement.placementId
      link.href = placement.content?.url ?? 'about:blank'
    }

    const img = element.querySelector<HTMLImageElement>('.moz-ads-placement-img')
    if (img) {
      img.onload = () => onLoad?.({ placement })
      img.onerror = (_event, _source, _lineno, _colno, error) => onError?.({
        placement,
        error: error as Error,
      })

      img.dataset.placementId = placement.placementId
      img.alt = (placement.content as ImageAd)?.alt_text ?? l('ad_image_default_alt')
      img.src = imageUrl
    }
  }

  function updateContainerSize() {
    const container = element.querySelector<HTMLDivElement>('.moz-ads-placement-container')
    if (container) {
      container.dataset.placementId = placement.placementId

      if (placement.fixedSize) {
        const { width, height } = placement.fixedSize
        container.style.width = width !== undefined ? `${width}px` : ''
        container.style.height = height !== undefined ? `${height}px` : ''
      }
    }
  }

  function attachEventListeners() {
    const reportButton = element.querySelector<HTMLButtonElement>('.moz-ads-placement-report-button')
    if (reportButton) {
      reportButton.onclick = (event) => {
        event.preventDefault()
        event.stopPropagation()

        const inner = element.querySelector<HTMLDivElement>('.moz-ads-placement-inner')
        if (inner) {
          inner.insertAdjacentHTML('beforeend', reportFormHtml)

          const link = element.querySelector<HTMLAnchorElement>('.moz-ads-placement-link')
          if (link) {
            link.hidden = true
          }

          reportButton.hidden = true

          const reportForm = element.querySelector<HTMLFormElement>('.moz-ads-placement-report-form')
          const reportCloseButton = element.querySelector<HTMLButtonElement>('.moz-ads-placement-report-close-button')
          const reportSelect = element.querySelector<HTMLSelectElement>('.moz-ads-placement-report-reason-select')
          const reportSubmitButton = element.querySelector<HTMLButtonElement>('.moz-ads-placement-report-submit-button')

          reportSelect?.focus()

          if (reportCloseButton) {
            reportCloseButton.onclick = () => {
              if (link) {
                link.hidden = false
              }

              reportButton.hidden = false

              reportForm?.remove()
            }
          }

          if (reportForm && reportSelect && reportSubmitButton) {
            reportForm.onsubmit = async (event) => {
              event.preventDefault()

              const reportTitleParagraph = element.querySelector<HTMLParagraphElement>('.moz-ads-placement-report-title')
              if (reportTitleParagraph) {
                reportTitleParagraph.textContent = l('report_form_title_success')

                if (link) {
                  link.onclick = event => event.preventDefault()
                  link.focus()
                }

                reportCloseButton?.remove()
                reportSelect.remove()
                reportSubmitButton.remove()

                const reason = reportSelect.value

                try {
                  const reportUrl = new URL(placement.content?.callbacks?.report ?? '')
                  reportUrl.searchParams.set('reason', reason)

                  try {
                    await fetch(reportUrl.toString(), { keepalive: true })

                    onReport?.({
                      placement,
                      reason,
                    })
                  }
                  catch (error: unknown) {
                    logger.error(`Report callback failed for: ${placement.placementId} with an unknown error.`, {
                      type: 'recordClick.callbackResponseError',
                      eventLabel: 'fetch_error',
                      path: reportUrl.toString(),
                      placementId: placement.placementId,
                      method: 'GET',
                      errorId: (error as Error)?.name,
                    })
                  }
                }
                catch (error: unknown) {
                  logger.error(`Invalid report callback URL for placement ID: ${placement.placementId}`, {
                    type: 'renderPlacement.reportCallbackInvalid',
                    eventLabel: 'invalid_url_error',
                    path: placement.content?.callbacks?.report ?? '',
                    placementId: placement.placementId,
                    errorId: (error as Error)?.name,
                  })
                }
              }
            }

            reportSelect.onchange = () => {
              reportSubmitButton.disabled = !reportSelect.value
            }
          }
        }
      }
    }
  }
}
