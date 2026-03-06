'use client'

import { useTranslations } from 'next-intl'
import { Code2, Cog, Workflow, Shield } from 'lucide-react'
import SectionLabel from '@/components/ui/SectionLabel'
import { useStaggerReveal } from '@/hooks/useStaggerReveal'

const SERVICES = [
  { key: 'systemsArch',       Icon: Code2    },
  { key: 'automation',        Icon: Cog      },
  { key: 'aiWorkflow',        Icon: Workflow },
  { key: 'securityHardening', Icon: Shield   },
] as const

export default function Capabilities() {
  const t = useTranslations('capabilities')
  const { ref, visible } = useStaggerReveal()

  return (
    <section
      id="capabilities"
      className="bg-surface border-t border-border px-6 lg:px-12 py-section-mobile md:py-section-desktop"
      aria-labelledby="capabilities-title"
    >
      <div className="max-w-content mx-auto">
        <SectionLabel>{t('label')}</SectionLabel>

        <h2 id="capabilities-title" className="text-h2-mobile md:text-h2-desktop mb-12 text-balance">
          {t('title')}
        </h2>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map(({ key, Icon }, i) => (
            <div
              key={key}
              className={`border border-border bg-background/40 rounded-2xl p-8 stagger-item${visible ? ' stagger-item--visible' : ''}`}
              style={{ '--stagger-i': i } as React.CSSProperties}
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon aria-hidden className="w-5 h-5 text-primary" />
                {/* Dynamic sub-key access: key is a known const, path is always valid */}
                <h3 className="text-h4">{t(`${key}.title` as any)}</h3>
              </div>
              <p className="text-body text-secondary">{t(`${key}.description` as any)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
