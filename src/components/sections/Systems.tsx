'use client'

import { useEffect, useState } from 'react'
import SectionLabel from '@/components/ui/SectionLabel'
import Button from '@/components/ui/Button'

type Lang = 'ro' | 'en'
const STORAGE_KEY = 'noku_lang'

const COPY = {
  ro: {
    label: 'Referințe',
    title: 'Platformă de emitere și arhivare pentru fluxuri reglementate.',
    body:
      'Sisteme construite pentru operațiuni cu cerințe stricte: date local-first, randare deterministă a template-urilor, export PDF, arhivare și jurnalizare auditabilă.',
    cta: 'Discută un sistem similar',
    aria: 'Discută un sistem similar',
  },
  en: {
    label: 'Reference Work',
    title: 'Issuance + archival platform for regulated workflows.',
    body:
      'Systems built for strict operational requirements: local-first data, deterministic template rendering, PDF export, archiving, and audit-grade logging.',
    cta: 'Discuss a similar system',
    aria: 'Discuss a similar system',
  },
} as const

function getLang(): Lang {
  if (typeof window === 'undefined') return 'ro'
  const saved = window.localStorage.getItem(STORAGE_KEY)
  return saved === 'en' ? 'en' : 'ro'
}

export default function Systems() {
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
      id="systems"
      className="bg-surface border-y border-border px-6 lg:px-12 py-section-mobile md:py-section-desktop"
      aria-labelledby="systems-title"
    >
      <div className="max-w-content mx-auto">
        <SectionLabel>{t.label}</SectionLabel>

        <h2 id="systems-title" className="text-h2-mobile md:text-h2-desktop mb-8 text-balance">
          {t.title}
        </h2>

        <p className="text-body-lg text-secondary mb-10 max-w-text">
          {t.body}
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="secondary" href="#engagement" aria-label={t.aria}>
            {t.cta}
          </Button>
        </div>
      </div>
    </section>
  )
}