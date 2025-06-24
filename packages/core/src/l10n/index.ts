import enUS from './en-US.json'

const DEFAULT_LANGUAGE: MozAdsLanguage = 'en-US'

type MozAdsLanguage = 'en-US'

export type MozAdsLocalizedStringKey = 'ad_image_default_alt'
  | 'loading_spinner_tooltip'
  | 'report_ad_button_tooltip'
  | 'report_form_close_button_tooltip'
  | 'report_form_select_reason_option_none'
  | 'report_form_select_reason_option_inappropriate'
  | 'report_form_select_reason_option_seen_too_many_times'
  | 'report_form_select_reason_option_not_interested'
  | 'report_form_submit_button'
  | 'report_form_title_default'
  | 'report_form_title_success'

const strings: Record<MozAdsLanguage, Record<MozAdsLocalizedStringKey, string>> = {
  'en-US': enUS,
}

export function l(key: MozAdsLocalizedStringKey): string {
  return strings[globalThis.navigator?.language as MozAdsLanguage]?.[key] ?? strings[DEFAULT_LANGUAGE]?.[key] ?? key
}
