'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useHomePanel } from '@/context/HomePanelContext'
import type { CubeFace } from '@/components/interactive/CubeNav'

// All six cube faces appear in the footer nav for full navigation coherence.
// Values match CubeFace exactly so the homepage intercept can cast directly.
const NAV_ROUTES = ['about', 'capabilities', 'approach', 'work', 'security', 'contact'] as const
type NavRoute = (typeof NAV_ROUTES)[number]

function swapLocaleInPath(pathname: string, next: string): string {
  if (!pathname) return `/${next}`
  const parts = pathname.split('/')
  if (parts.length >= 2 && (parts[1] === 'ro' || parts[1] === 'en')) {
    parts[1] = next
    return parts.join('/') || `/${next}`
  }
  return `/${next}${pathname.startsWith('/') ? pathname : `/${pathname}`}`
}

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const t           = useTranslations('footer')
  const locale      = useLocale()
  const pathname    = usePathname()

  const { toggleFace } = useHomePanel()

  // /ro → 1 segment → home; /ro/capabilities → 2 segments → sub-route
  const isHome = pathname.split('/').filter(Boolean).length <= 1

  function handleNavClick(route: NavRoute, e: React.MouseEvent<HTMLAnchorElement>) {
    if (!isHome) return
    e.preventDefault()
    toggleFace(route as CubeFace)
    // Panel scroll is handled by Hero's useEffect watching activeFace.
  }

  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-content mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-h3-mobile md:text-h3-desktop mb-4">{t('imprint')}</h3>
            <p className="text-body text-secondary max-w-md">{t('tagline')}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-10 sm:justify-end">
            {/* ── Navigation ──────────────────────────────────────────── */}
            <div>
              <h4 className="text-h4 mb-4">{t('navTitle')}</h4>
              <ul className="space-y-3">
                {NAV_ROUTES.map((route) => (
                  <li key={route}>
                    {/*
                      Always render an <a> with a valid href so the link works on
                      sub-pages, is right-click-copyable, and is crawlable.
                      On the homepage the click is intercepted to open the inline panel.
                    */}
                    <a
                      href={`/${locale}/${route}`}
                      onClick={(e) => handleNavClick(route, e)}
                      className="text-body text-secondary hover:text-primary transition-colors"
                    >
                      {t(`nav.${route}` as any)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Language switcher ────────────────────────────────────── */}
            <div>
              <h4 className="text-h4 mb-4">{t('langLabel')}</h4>
              <div className="flex items-center gap-2">
                {(['ro', 'en'] as const).map((l) => (
                  <a
                    key={l}
                    href={swapLocaleInPath(pathname, l)}
                    className={[
                      'px-3 py-2 rounded-xl border border-border text-small transition-colors',
                      locale === l
                        ? 'bg-background text-primary'
                        : 'bg-transparent text-secondary hover:text-primary',
                    ].join(' ')}
                    aria-current={locale === l ? 'true' : undefined}
                  >
                    {l.toUpperCase()}
                  </a>
                ))}
              </div>

              <p className="text-small text-muted mt-3 max-w-[26ch]">
                {t('langNote')}
              </p>
            </div>
          </div>
        </div>

        {/* ── Legal bar ───────────────────────────────────────────────── */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-small text-muted">
              {currentYear} {t('imprint')}
            </p>

            <div className="flex gap-6">
              <a
                href={`/${locale}/privacy`}
                className="text-small text-muted hover:text-secondary transition-colors"
              >
                {t('legalPrivacy')}
              </a>
              <a
                href={`/${locale}/terms`}
                className="text-small text-muted hover:text-secondary transition-colors"
              >
                {t('legalTerms')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
