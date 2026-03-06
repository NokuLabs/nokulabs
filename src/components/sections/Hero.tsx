'use client'

import { useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Button from '@/components/ui/Button'
import CubeNav from '@/components/interactive/CubeNav'
import type { CubeFace } from '@/components/interactive/CubeNav'
import ActiveSectionPanel from '@/components/interactive/ActiveSectionPanel'
import { useHomePanel } from '@/context/HomePanelContext'

export default function Hero() {
  const t = useTranslations('hero')

  const { activeFace, toggleFace } = useHomePanel()
  const panelRef = useRef<HTMLDivElement>(null)

  // Scroll the panel into view whenever a face is opened or switched.
  // 80 ms delay lets the DOM commit the new section before scrollIntoView fires.
  useEffect(() => {
    if (!activeFace || !panelRef.current) return
    const timer = setTimeout(() => {
      panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
    return () => clearTimeout(timer)
  }, [activeFace])

  return (
    <>
      <section
        id="hero"
        className="relative min-h-screen flex items-center pt-20 pb-section-mobile md:pb-section-desktop px-6 lg:px-12 overflow-hidden"
        aria-labelledby="hero-title"
      >
        {/* ── Background layers ───────────────────────────────────────────── */}
        <div className="absolute inset-0 grid-background opacity-40" aria-hidden="true" />

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
          <div className="flex flex-col md:flex-row items-center gap-16 md:gap-12 lg:gap-20">

            {/* ── Text column ─────────────────────────────────────────────── */}
            <div className="flex-1 min-w-0 md:max-w-xl lg:max-w-2xl">
              {/* LCP element: never animate h1 */}
              <h1 id="hero-title" className="text-h1-mobile md:text-h1-desktop mb-8 text-balance">
                {t('h1')}
              </h1>

              <p className="reveal reveal-delay-1 text-h2-mobile md:text-h2-desktop text-secondary mb-8 text-balance">
                {t('sub')}
              </p>

              <p className="reveal reveal-delay-2 text-body-lg text-secondary mb-12 max-w-text">
                {t('body')}
              </p>

              <div className="reveal reveal-delay-3 flex flex-col sm:flex-row gap-4">
                <Button variant="primary" onClick={() => toggleFace('contact')}>
                  {t('ctaPrimary')}
                </Button>
                <Button variant="secondary" onClick={() => toggleFace('approach')}>
                  {t('ctaSecondary')}
                </Button>
              </div>

              <p className="text-sm text-secondary mt-4">{t('trustLine')}</p>
              <p className="text-sm text-secondary mt-1">{t('secondTrustLine')}</p>
            </div>

            {/* ── Cube column ─────────────────────────────────────────────── */}
            <div className="flex-none flex items-center justify-center">
              <div className="hidden md:block">
                <CubeNav size={280} onFaceSelect={(face: CubeFace) => toggleFace(face)} />
              </div>
              <div className="md:hidden">
                <CubeNav size={210} onFaceSelect={(face: CubeFace) => toggleFace(face)} />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Inline section panel ─────────────────────────────────────────── */}
      {activeFace && (
        <div ref={panelRef}>
          <div key={activeFace} className="section-panel-enter">
            <ActiveSectionPanel face={activeFace} />
          </div>
        </div>
      )}
    </>
  )
}
