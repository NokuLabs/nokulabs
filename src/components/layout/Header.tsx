'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/types'

type Locale = 'ro' | 'en'

const I18N: Record<Locale, { brandAria: string; navAria: string; menuAria: string; closeAria: string; nav: NavItem[]; toggleAria: string; }> = {
  ro: {
    brandAria: 'NOKU LABS acasă',
    navAria: 'Navigație principală',
    menuAria: 'Deschide meniul de navigație',
    closeAria: 'Închide meniul de navigație',
    nav: [
      { label: 'Capabilități', href: '#capabilities' },
      { label: 'Abordare', href: '#approach' },
      { label: 'Referințe', href: '#systems' },
      { label: 'Contact', href: '#engagement' },
    ],
    toggleAria: 'Schimbă limba',
  },
  en: {
    brandAria: 'NOKU LABS home',
    navAria: 'Primary navigation',
    menuAria: 'Open navigation menu',
    closeAria: 'Close navigation menu',
    nav: [
      { label: 'Capabilities', href: '#capabilities' },
      { label: 'Approach', href: '#approach' },
      { label: 'Reference Work', href: '#systems' },
      { label: 'Contact', href: '#engagement' },
    ],
    toggleAria: 'Switch language',
  },
}

function otherLocale(l: Locale): Locale {
  return l === 'ro' ? 'en' : 'ro'
}

// Replace only the leading "/ro" or "/en" segment.
function swapLocaleInPath(pathname: string, next: Locale) {
  if (!pathname) return `/${next}`
  const parts = pathname.split('/')
  // pathname starts with "" then locale
  if (parts.length >= 2 && (parts[1] === 'ro' || parts[1] === 'en')) {
    parts[1] = next
    return parts.join('/') || `/${next}`
  }
  // fallback if route is unexpected
  return `/${next}${pathname.startsWith('/') ? pathname : `/${pathname}`}`
}

export default function Header() {
  const locale = (useLocale() as Locale) || 'ro'
  const pathname = usePathname() || `/${locale}`

  const [activeSection, setActiveSection] = useState<string>('hero')
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = I18N[locale].nav

  const sectionIds = useMemo(
    () => ['hero', ...navItems.map((n) => n.href.replace('#', ''))],
    [navItems]
  )

  const ioRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    ioRef.current?.disconnect()

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0]

        if (visible?.target?.id) setActiveSection(visible.target.id)
      },
      { root: null, rootMargin: '-30% 0px -60% 0px', threshold: [0.12, 0.2, 0.35, 0.5, 0.75] }
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })

    ioRef.current = io
    return () => io.disconnect()
  }, [sectionIds])

  useEffect(() => {
    const onHash = () => setMobileOpen(false)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  function onNavClick(href: string) {
    setMobileOpen(false)
    window.location.hash = href
  }

  function onToggleLocale() {
    const next = otherLocale(locale)

    // keep hash when switching locale
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    const nextPath = swapLocaleInPath(pathname, next) + hash

    window.location.href = nextPath
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-background/95 backdrop-blur-sm border-b border-border' : 'bg-transparent'
      )}
    >
      <div className="max-w-content mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <a
            href="#hero"
            className="text-h4 font-mono font-semibold tracking-tight hover:text-accent transition-colors"
            aria-label={I18N[locale].brandAria}
          >
            NOKU LABS
          </a>

          <div className="flex items-center gap-3">
            <nav className="hidden md:block" aria-label={I18N[locale].navAria}>
              <ul className="flex items-center gap-8">
                {navItems.map((item) => {
                  const id = item.href.replace('#', '')
                  const isActive = activeSection === id

                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          'text-body font-medium transition-colors relative group focus:outline-none',
                          isActive ? 'text-primary' : 'text-secondary hover:text-primary'
                        )}
                      >
                        {item.label}
                        <span
                          className={cn(
                            'absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full',
                            isActive && 'w-full'
                          )}
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <button
              type="button"
              className={cn(
                'md:hidden inline-flex items-center justify-center rounded-full border border-border',
                'px-3 py-2 text-small font-medium bg-background/60 hover:bg-background/80 transition-colors'
              )}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? I18N[locale].closeAria : I18N[locale].menuAria}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (locale === 'ro' ? 'Închide' : 'Close') : (locale === 'ro' ? 'Meniu' : 'Menu')}
            </button>

            <button
              type="button"
              onClick={onToggleLocale}
              aria-label={I18N[locale].toggleAria}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border border-border',
                'px-3 py-2 text-small font-medium',
                'bg-background/60 hover:bg-background/80 transition-colors'
              )}
            >
              <span className="text-secondary">{otherLocale(locale).toUpperCase()}</span>
              <span className="w-px h-4 bg-border" aria-hidden="true" />
              <span className="text-primary">{locale.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/98 backdrop-blur-sm">
          <div className="max-w-content mx-auto px-6 py-4">
            <ul className="flex flex-col gap-3">
              {navItems.map((item) => {
                const id = item.href.replace('#', '')
                const isActive = activeSection === id
                return (
                  <li key={item.href}>
                    <button
                      type="button"
                      onClick={() => onNavClick(item.href)}
                      className={cn(
                        'w-full text-left px-3 py-3 rounded-xl border border-border transition-colors',
                        isActive ? 'bg-surface text-primary' : 'bg-background text-secondary hover:text-primary'
                      )}
                    >
                      {item.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </header>
  )
}