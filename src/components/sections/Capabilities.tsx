'use client'

import { useEffect, useState } from 'react'
import { Code2, Cog, Workflow, Shield } from 'lucide-react'
import SectionLabel from '@/components/ui/SectionLabel'
import type { ServiceCard } from '@/types'

type Lang = 'ro' | 'en'
const STORAGE_KEY = 'noku_lang'

const iconMap = {
  code: Code2,
  cog: Cog,
  workflow: Workflow,
  shield: Shield,
} as const

const COPY = {
  ro: {
    label: 'Capabilități',
    title: 'Construit pentru medii cu încredere ridicată și risc real.',
    services: [
      {
        title: 'Arhitectură de sisteme',
        description: 'Design infrastructură, integrare, roadmap tehnic și decizii de platformă.',
        icon: 'code',
      },
      {
        title: 'Inginerie de automatizări',
        description: 'Digitalizare procese, orchestrare workflow, tool-uri operaționale și integrare API.',
        icon: 'cog',
      },
      {
        title: 'Integrare AI în fluxuri',
        description: 'Automatizare pipeline, integrare modele, evaluare risc și operare în sisteme existente.',
        icon: 'workflow',
      },
      {
        title: 'Hardening de securitate',
        description: 'Threat modeling, control acces (RBAC), audit logging și pregătire pentru conformitate.',
        icon: 'shield',
      },
    ] as ServiceCard[],
  },
  en: {
    label: 'Capabilities',
    title: 'Built for high-trust, high-stakes environments.',
    services: [
      {
        title: 'Systems Architecture',
        description: 'Infrastructure design, integration planning, and technical roadmap development.',
        icon: 'code',
      },
      {
        title: 'Automation Engineering',
        description: 'Process digitization, workflow orchestration, and operational tooling.',
        icon: 'cog',
      },
      {
        title: 'AI Workflow Integration',
        description: 'Model integration, pipeline automation, and operational ML within existing systems.',
        icon: 'workflow',
      },
      {
        title: 'Security Hardening',
        description: 'Threat modeling, access control (RBAC), audit logging, and compliance readiness.',
        icon: 'shield',
      },
    ] as ServiceCard[],
  },
} as const

function getLang(): Lang {
  if (typeof window === 'undefined') return 'ro'
  const saved = window.localStorage.getItem(STORAGE_KEY)
  return saved === 'en' ? 'en' : 'ro'
}

export default function Capabilities() {
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
      id="capabilities"
      className="bg-surface border-t border-border px-6 lg:px-12 py-section-mobile md:py-section-desktop"
      aria-labelledby="capabilities-title"
    >
      <div className="max-w-content mx-auto">
        <SectionLabel>{t.label}</SectionLabel>

        <h2 id="capabilities-title" className="text-h2-mobile md:text-h2-desktop mb-12 text-balance">
          {t.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {t.services.map((s) => {
            const Icon = iconMap[s.icon as keyof typeof iconMap]
            return (
              <div key={s.title} className="border border-border bg-background/40 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Icon aria-hidden="true" className="w-5 h-5 text-primary" />
                  <h3 className="text-h4">{s.title}</h3>
                </div>
                <p className="text-body text-secondary">{s.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}