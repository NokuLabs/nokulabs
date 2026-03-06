import { getRequestConfig } from 'next-intl/server'
import { locales, defaultLocale, type Locale } from '@/app/i18n'

export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale resolves to the value set by setRequestLocale() in layout —
  // no HTTP headers are read when setRequestLocale is called first.
  let locale = await requestLocale
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale
  }

  return {
    locale,
    messages: (await import(`@/app/messages/${locale}.json`)).default,
  }
})
