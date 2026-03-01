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

type ColumnKey = 'constraints' | 'failure' | 'discipline'

const CONTENT: Record<
  Lang,
  {
    label: string
    headline: string
    columns: Array<{ key: ColumnKey; title: string; description: string }>
  }
> = {
  en: {
    label: 'Approach',
    headline: 'Architecture-first delivery.',
    columns: [
      {
        key: 'constraints',
        title: 'Operate on constraints',
        description:
          'We design under real operational limits: offline-first, audit trails, and strict change control.',
      },
      {
        key: 'failure',
        title: 'Engineer for failure',
        description:
          'We assume failures happen and build systems that degrade safely, log everything, and recover cleanly.',
      },
      {
        key: 'discipline',
        title: 'Ship with discipline',
        description:
          'Clear scopes. Deterministic delivery. Documentation that survives audits and personnel turnover.',
      },
    ],
  },
  ro: {
    label: 'Abordare',
    headline: 'Livrare orientată pe arhitectură.',
    columns: [
      {
        key: 'constraints',
        title: 'Operăm pe constrângeri',
        description:
          'Proiectăm sub limite operaționale reale: offline-first, trasabilitate completă și control strict al schimbărilor.',
      },
      {
        key: 'failure',
        title: 'Inginerie pentru eșec',
        description:
          'Presupunem că eșecurile apar și construim sisteme care degradează controlat, loghează tot și se recuperează curat.',
      },
      {
        key: 'discipline',
        title: 'Livrare cu disciplină',
        description:
          'Scope clar. Livrare deterministă. Documentație care rezistă auditului și schimbării de personal.',
      },
    ],
  },
}

export default function Approach() {
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
      id="approach"
      className="px-6 lg:px-12 py-section-mobile md:py-section-desktop"
      aria-labelledby="approach-title"
    >
      <div className="max-w-content mx-auto">
        <SectionLabel>{c.label}</SectionLabel>

        <h2
          id="approach-title"
          className="text-h2-mobile md:text-h2-desktop mb-12 text-balance"
        >
          {c.headline}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {c.columns.map((col) => (
            <div
              key={col.key}
              className="border border-border bg-surface rounded-2xl p-8"
            >
              <h3 className="text-h4 mb-3">{col.title}</h3>
              <p className="text-body text-secondary">{col.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}