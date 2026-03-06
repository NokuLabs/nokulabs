'use client'

import { useTranslations } from 'next-intl'
import SectionLabel from '@/components/ui/SectionLabel'
import { useStaggerReveal } from '@/hooks/useStaggerReveal'

// Named keys eliminate the array-index key anti-pattern
const ITEM_KEYS = ['item1', 'item2', 'item3', 'item4'] as const

export default function Security() {
  const t = useTranslations('security')
  const { ref, visible } = useStaggerReveal<HTMLUListElement>()

  return (
    <section
      id="security"
      className="bg-surface border-t border-border px-6 lg:px-12 py-section-mobile md:py-section-desktop"
      aria-labelledby="security-title"
    >
      <div className="max-w-content mx-auto">
        <SectionLabel>{t('label')}</SectionLabel>

        <h2
          id="security-title"
          className="text-h2-mobile md:text-h2-desktop mb-8 text-balance"
        >
          {t('title')}
        </h2>

        <ul ref={ref} className="space-y-4 text-body text-secondary max-w-text">
          {ITEM_KEYS.map((key, i) => (
            <li
              key={key}
              className={`stagger-item${visible ? ' stagger-item--visible' : ''}`}
              style={{ '--stagger-i': i } as React.CSSProperties}
            >
              {t(key)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
