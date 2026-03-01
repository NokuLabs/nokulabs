'use client'

import { useEffect, useMemo, useState } from 'react'
import type { NavItem } from '@/types'

type Lang = 'en' | 'ro'
const STORAGE_KEY = 'noku_lang'

function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'ro'
  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (saved === 'ro' || saved === 'en') return saved
  const prefersRo = window.navigator.language?.toLowerCase().startsWith('ro')
  return prefersRo ? 'ro' : 'en'
}

function setLang(lang: Lang) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, lang)
  window.dispatchEvent(new CustomEvent('noku-lang-change', { detail: { lang } }))
}

const NAV: Record<Lang, NavItem[]> = {
  en: [
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'Approach', href: '#approach' },
    { label: 'Reference Work', href: '#systems' },
    { label: 'Contact', href: '#engagement' },
  ],
  ro: [
    { label: 'Capabilități', href: '#capabilities' },
    { label: 'Abordare', href: '#approach' },
    { label: 'Referințe', href: '#systems' },
    { label: 'Contact', href: '#engagement' },
  ],
}

const COPY: Record<
  Lang,
  {
    tagline: string
    navTitle: string
    legalPrivacy: string
    legalTerms: string
    imprint: string
    langLabel: string
    ro: string
    en: string
  }
> = {
  en: {
    tagline: 'Architecture-first systems. Built to hold under scrutiny.',
    navTitle: 'Navigation',
    legalPrivacy: 'Privacy',
    legalTerms: 'Terms',
    imprint: 'NOKU LABS',
    langLabel: 'Language',
    ro: 'RO',
    en: 'EN',
  },
  ro: {
    tagline: 'Sisteme orientate pe arhitectură. Construite să reziste sub analiză.',
    navTitle: 'Navigare',
    legalPrivacy: 'Confidențialitate',
    legalTerms: 'Termeni',
    imprint: 'NOKU LABS',
    langLabel: 'Limbă',
    ro: 'RO',
    en: 'EN',
  },
}

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [lang, setLangState] = useState<Lang>('ro')

  useEffect(() => {
    setLangState(getInitialLang())
    const onLang = (e: Event) => {
      const detail = (e as CustomEvent).detail as { lang?: Lang } | undefined
      if (detail?.lang === 'en' || detail?.lang === 'ro') setLangState(detail.lang)
      else setLangState(getInitialLang())
    }
    window.addEventListener('noku-lang-change', onLang as EventListener)
    return () => window.removeEventListener('noku-lang-change', onLang as EventListener)
  }, [])

  const c = useMemo(() => COPY[lang], [lang])
  const navItems = useMemo(() => NAV[lang], [lang])

  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-content mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-h3-mobile md:text-h3-desktop mb-4">{c.imprint}</h3>
            <p className="text-body text-secondary max-w-md">{c.tagline}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-10 sm:justify-end">
            <div>
              <h4 className="text-h4 mb-4">{c.navTitle}</h4>
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-body text-secondary hover:text-primary transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-h4 mb-4">{c.langLabel}</h4>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLang('ro')}
                  className={[
                    'px-3 py-2 rounded-xl border border-border text-small transition-colors',
                    lang === 'ro'
                      ? 'bg-background text-primary'
                      : 'bg-transparent text-secondary hover:text-primary',
                  ].join(' ')}
                  aria-pressed={lang === 'ro'}
                >
                  {c.ro}
                </button>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={[
                    'px-3 py-2 rounded-xl border border-border text-small transition-colors',
                    lang === 'en'
                      ? 'bg-background text-primary'
                      : 'bg-transparent text-secondary hover:text-primary',
                  ].join(' ')}
                  aria-pressed={lang === 'en'}
                >
                  {c.en}
                </button>
              </div>

              <p className="text-small text-muted mt-3 max-w-[26ch]">
                {lang === 'ro'
                  ? 'Limba se aplică instant, fără refresh.'
                  : 'Applies instantly, no refresh.'}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-small text-muted">
              {currentYear} {c.imprint}
            </p>

            <div className="flex gap-6">
              <a
                href="/privacy"
                className="text-small text-muted hover:text-secondary transition-colors"
              >
                {c.legalPrivacy}
              </a>
              <a
                href="/terms"
                className="text-small text-muted hover:text-secondary transition-colors"
              >
                {c.legalTerms}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}