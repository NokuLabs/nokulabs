import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './app/i18n'

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed' // en fără /en, ro cu /ro
})

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)']
}