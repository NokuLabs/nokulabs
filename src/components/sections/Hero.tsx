'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'

type Lang = 'ro' | 'en'
const STORAGE_KEY = 'noku_lang'

const COPY = {
  ro: {
    h1: 'Software „infrastructure-grade” pentru medii operaționale.',
    sub: 'Arhitectăm sisteme pentru organizații unde eșecul are consecințe.',
    body:
      'Dezvoltare custom, automatizări, integrare AI și hardening de securitate pentru operațiuni reglementate sau mission-critical.',
    ctaPrimary: 'Solicită o evaluare',
    ctaSecondary: 'Vezi abordarea',
    ariaPrimary: 'Solicită o evaluare',
    ariaSecondary: 'Vezi abordarea',
  },
  en: {
    h1: 'Infrastructure-grade software for operational environments.',
    sub: 'We architect systems for organizations where failure has consequences.',
    body:
      'Custom development, automation engineering, AI workflow integration, and security hardening for regulated and mission-critical operations.',
    ctaPrimary: 'Request a review',
    ctaSecondary: 'See the approach',
    ariaPrimary: 'Request a review',
    ariaSecondary: 'See the approach',
  },
} as const

function getLang(): Lang {
  if (typeof window === 'undefined') return 'ro'
  const saved = window.localStorage.getItem(STORAGE_KEY)
  return saved === 'en' ? 'en' : 'ro'
}

export default function Hero() {
  const [lang, setLang] = useState<Lang>('ro')

  useEffect(() => {
    setLang(getLang())

    const onLang = (e: Event) => {
      const detail = (e as CustomEvent).detail as { lang?: Lang } | undefined
      if (detail?.lang === 'en' || detail?.lang === 'ro') setLang(detail.lang)
    }

    window.addEventListener('noku-lang-change', onLang as EventListener)
    return () => window.removeEventListener('noku-lang-change', onLang as EventListener)
  }, [])

  const t = COPY[lang]

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-20 pb-section-mobile md:pb-section-desktop px-6 lg:px-12 overflow-hidden"
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0 grid-background opacity-40" aria-hidden="true" />

      {/* contrast overlay (A11y) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-80 bg-gradient-to-b from-background via-transparent to-background"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-content mx-auto w-full">
        <div className="max-w-5xl">
          {/* LCP: do NOT animate h1 */}
          <h1 id="hero-title" className="text-h1-mobile md:text-h1-desktop mb-8 text-balance">
            {t.h1}
          </h1>

          {/* Below-the-fold-ish copy can animate */}
          <p className="reveal reveal-delay-1 text-h2-mobile md:text-h2-desktop text-secondary mb-8 text-balance">
            {t.sub}
          </p>

          <p className="reveal reveal-delay-2 text-body-lg text-secondary mb-12 max-w-text">
            {t.body}
          </p>

          <div className="reveal reveal-delay-3 flex flex-col sm:flex-row gap-4">
            <Button variant="primary" href="#engagement" aria-label={t.ariaPrimary}>
              {t.ctaPrimary}
            </Button>
            <Button variant="secondary" href="#approach" aria-label={t.ariaSecondary}>
              {t.ctaSecondary}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
