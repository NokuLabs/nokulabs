'use client'

import { useTranslations } from 'next-intl'
import SectionLabel from '@/components/ui/SectionLabel'

const COLUMN_KEYS = ['constraints', 'failure', 'discipline'] as const

export default function Approach() {
  const t = useTranslations('approach')

  return (
    <section
      id="approach"
      className="border-t border-border px-6 lg:px-12 py-section-mobile md:py-section-desktop"
      aria-labelledby="approach-title"
    >
      <div className="max-w-content mx-auto">
        <SectionLabel>{t('label')}</SectionLabel>

        <h2
          id="approach-title"
          className="text-h2-mobile md:text-h2-desktop mb-12 text-balance"
        >
          {t('headline')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMN_KEYS.map((key) => (
            <div
              key={key}
              className="border border-border bg-surface rounded-2xl p-8"
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
