'use client'

import { useTranslations } from 'next-intl'
import SectionLabel from '@/components/ui/SectionLabel'
import { useStaggerReveal } from '@/hooks/useStaggerReveal'

const PILLAR_KEYS = ['directEngagement', 'smallByDesign', 'builtToLast'] as const

export default function About() {
  const t = useTranslations('about')
  const { ref, visible } = useStaggerReveal()

  return (
    <section
      id="about"
      className="bg-surface border-t border-border px-6 lg:px-12 py-section-mobile md:py-section-desktop"
      aria-labelledby="about-title"
    >
      <div className="max-w-content mx-auto">
        <SectionLabel>{t('label')}</SectionLabel>

        <h2 id="about-title" className="text-h2-mobile md:text-h2-desktop mb-6 text-balance">
          {t('headline')}
        </h2>

        <p className="text-body-lg text-secondary mb-12 max-w-text">
          {t('body')}
        </p>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLAR_KEYS.map((key, i) => (
            <div
              key={key}
              className={`border border-border bg-background/40 rounded-2xl p-8 stagger-item${visible ? ' stagger-item--visible' : ''}`}
              style={{ '--stagger-i': i } as React.CSSProperties}
            >
              <h3 className="text-h4 mb-3">{t(`${key}.title` as any)}</h3>
              <p className="text-body text-secondary">{t(`${key}.description` as any)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
