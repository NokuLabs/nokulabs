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

const COPY: Record<
  Lang,
  {
    label: string
    title: string
    items: string[]
  }
> = {
  en: {
    label: 'Security',
    title: 'Security hardening is part of the architecture — not an add-on.',
    items: [
      'Threat modeling and risk mapping',
      'Access control design (RBAC), audit logging, and change control',
      'Encryption at rest, secrets handling, and local-only data strategies',
      'Operational security posture review',
    ],
  },
  ro: {
    label: 'Securitate',
    title: 'Hardening-ul de securitate face parte din arhitectură — nu este un add-on.',
    items: [
      'Threat modeling și mapare de risc',
      'Proiectare control acces (RBAC), audit logging și control al schimbărilor',
      'Criptare la rest, gestionare secrete și strategii local-only',
      'Review al posturii operaționale de securitate',
    ],
  },
}

export default function Security() {
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

  const c = useMemo(() => COPY[lang], [lang])

  return (
    <section
      id="security"
      className="px-6 lg:px-12 py-section-mobile md:py-section-desktop"
      aria-labelledby="security-title"
    >
      <div className="max-w-content mx-auto">
        <SectionLabel>{c.label}</SectionLabel>

        <h2
          id="security-title"
          className="text-h2-mobile md:text-h2-desktop mb-8 text-balance"
        >
          {c.title}
        </h2>

        <ul className="space-y-4 text-body text-secondary max-w-text">
          {c.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}