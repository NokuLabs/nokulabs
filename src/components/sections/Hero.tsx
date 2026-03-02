'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import Button from '@/components/ui/Button'
import CubeNav from '@/components/interactive/CubeNav'
import type { CubeFace } from '@/components/interactive/CubeNav'

type Lang = 'ro' | 'en'
const STORAGE_KEY = 'noku_lang'

const COPY = {
  ro: {
    h1: 'Software construit pentru medii care nu pot eșua.',
    sub: 'Lucrăm cu organizații unde oprirea sistemelor este o răspundere, nu o statistică.',
    body: 'Dezvoltare custom, automatizări, integrare AI și hardening de securitate. Livrate cu rigoarea pe care operațiunile reglementate și mission-critical o impun.',
    ctaPrimary: 'Inițiați colaborarea',
    ctaSecondary: 'Consultați abordarea',
    ariaPrimary: 'Inițiați colaborarea',
    ariaSecondary: 'Consultați abordarea',
    trustLine: 'Răspuns direct în 24 de ore.',
    secondTrustLine: 'Fără intermediari. Fără obligații.',
  },
  en: {
    h1: 'Software built for environments that cannot fail.',
    sub: 'We work with organizations where downtime is a liability, not a metric.',
    body: 'Custom development, automation, AI integration, and security hardening. Delivered with the rigor that regulated and mission-critical operations demand.',
    ctaPrimary: 'Begin engagement',
    ctaSecondary: 'Review the approach',
    ariaPrimary: 'Begin engagement',
    ariaSecondary: 'Review the approach',
    trustLine: 'Direct response within 24 hours.',
    secondTrustLine: 'No intermediaries. No obligation.',
  },
} as const

// Each cube face navigates to its own dedicated route.
const FACE_ROUTES: Record<CubeFace, string> = {
  about:        'about',
  capabilities: 'capabilities',
  approach:     'approach',
  work:         'work',
  security:     'security',
  contact:      'contact',
}

function getLang(): Lang {
  if (typeof window === 'undefined') return 'ro'
  const saved = window.localStorage.getItem(STORAGE_KEY)
  return saved === 'en' ? 'en' : 'ro'
}

export default function Hero() {
  const [lang, setLang] = useState<Lang>('ro')
  const router = useRouter()
  const locale = useLocale()

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
      className="relative min-h-screen flex items-center pt-20 pb-section-mobile md:pb-section-desktop px-6 lg:px-12 overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* ── Background layers ───────────────────────────────────────────── */}
      <div className="absolute inset-0 grid-background opacity-40" aria-hidden="true" />

      {/* Radial depth gradient — adds premium depth without heavy assets */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 65% 50%, rgba(255,255,255,0.018) 0%, transparent 70%), ' +
            'linear-gradient(to bottom, rgba(10,10,10,0.85) 0%, transparent 35%, transparent 65%, rgba(10,10,10,0.9) 100%)',
        }}
        aria-hidden="true"
      />

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-content mx-auto w-full">
        {/*
          Two-column layout on md+:
            Left:  text + CTAs  (flex-1)
            Right: 3D cube      (flex-none)
          Single column on mobile — cube stacks below text.
        */}
        <div className="flex flex-col md:flex-row items-center gap-16 md:gap-12 lg:gap-20">

          {/* ── Text column ─────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 md:max-w-xl lg:max-w-2xl">
            {/* LCP element: never animate h1 */}
            <h1 id="hero-title" className="text-h1-mobile md:text-h1-desktop mb-8 text-balance">
              {t.h1}
            </h1>

            <p className="reveal reveal-delay-1 text-h2-mobile md:text-h2-desktop text-secondary mb-8 text-balance">
              {t.sub}
            </p>

            <p className="reveal reveal-delay-2 text-body-lg text-secondary mb-12 max-w-text">
              {t.body}
            </p>

            <div className="reveal reveal-delay-3 flex flex-col sm:flex-row gap-4">
              <Button variant="primary" href={`/${locale}/contact`} aria-label={t.ariaPrimary}>
                {t.ctaPrimary}
              </Button>
              <Button variant="secondary" href={`/${locale}/about`} aria-label={t.ariaSecondary}>
                {t.ctaSecondary}
              </Button>
            </div>

            <p className="text-sm text-secondary mt-4">{t.trustLine}</p>
            <p className="text-sm text-secondary mt-1">{t.secondTrustLine}</p>
          </div>

          {/* ── Cube column ─────────────────────────────────────────────── */}
          {/* CubeNav renders its own active-face status label internally. */}
          <div className="flex-none flex items-center justify-center">
            <div className="hidden md:block">
              <CubeNav
                size={280}
                onFaceSelect={(face) => router.push(`/${locale}/${FACE_ROUTES[face]}`)}
              />
            </div>
            <div className="md:hidden">
              <CubeNav
                size={210}
                onFaceSelect={(face) => router.push(`/${locale}/${FACE_ROUTES[face]}`)}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
