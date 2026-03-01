'use client'

import { useEffect, useMemo, useState } from 'react'
import SectionLabel from '@/components/ui/SectionLabel'

type Lang = 'en' | 'ro'
const STORAGE_KEY = 'noku_lang'

function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (saved === 'ro' || saved === 'en') return saved
  const prefersRo = window.navigator.language?.toLowerCase().startsWith('ro')
  return prefersRo ? 'ro' : 'en'
}

type PillarKey = 'audit' | 'discipline' | 'local'

const CONTENT: Record<
  Lang,
  {
    label: string
    headline: string
    pillars: Array<{ key: PillarKey; title: string; description: string }>
  }
> = {
  en: {
    label: 'Trust Signals',
    headline: 'Built for environments where errors have consequences.',
    pillars: [
      {
        key: 'audit',
        title: 'Audit-ready by design',
        description:
          'Immutable logs, RBAC, and deterministic outputs embedded directly into the workflow.',
      },
      {
        key: 'discipline',
        title: 'Operational discipline',
        description:
          'Clear scope, clear ownership, and documentation that holds under scrutiny.',
      },
      {
        key: 'local',
        title: 'Local-first capability',
        description:
          'Systems that continue operating when networks fail or constraints tighten.',
      },
    ],
  },
  ro: {
    label: 'Semnale de încredere',
    headline: 'Construit pentru medii unde erorile au consecințe.',
    pillars: [
      {
        key: 'audit',
        title: 'Pregătit pentru audit din design',
        description:
          'Loguri imutabile, RBAC și output determinist integrate direct în workflow.',
      },
      {
        key: 'discipline',
        title: 'Disciplină operațională',
        description:
          'Scope clar, responsabilitate clară și documentație care rezistă sub analiză.',
      },
      {
        key: 'local',
        title: 'Capabilitate local-first',
        description:
          'Sisteme care continuă să funcționeze când rețeaua cade sau constrângerile cresc.',
      },
    ],
  },
}

export default function TrustSignals() {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    setLang(getInitialLang())
    const onLang = (e: Event) => {
      const detail = (e as CustomEvent).detail as { lang?: Lang } | undefined
      if (detail?.lang === 'en' || detail?.lang === 'ro') setLang(detail.lang)
      else setLang(getInitialLang())
    }
    window.addEventListener('noku-lang-change', onLang as EventListener)
    return () => window.removeEventListener('noku-lang-change', onLang as EventListener)
  }, [])

  const c = useMemo(() => CONTENT[lang], [lang])

  return (
    <section
      id="trust"
      className="bg-surface border-t border-border px-6 lg:px-12 py-section-mobile md:py-section-desktop"
      aria-labelledby="trust-title"
    >
      <div className="max-w-content mx-auto">
        <SectionLabel>{c.label}</SectionLabel>

        <h2 id="trust-title" className="text-h2-mobile md:text-h2-desktop mb-12 text-balance">
          {c.headline}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {c.pillars.map((p) => (
            <div
              key={p.key}
              className="border border-border bg-background/40 rounded-2xl p-8"
            >
              <h3 className="text-h4 mb-3">{p.title}</h3>
              <p className="text-body text-secondary">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}